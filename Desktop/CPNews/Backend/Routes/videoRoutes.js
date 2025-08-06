const express = require('express');
const router = express.Router();
const { createUploadMiddleware } = require('../middleware/uploads');
const Video = require('../Models/Video');
const fs = require('fs');
const path = require('path');
const authController = require('../Controllers/authController');

// Create upload middleware for videos
const videoUpload = createUploadMiddleware('videos');

// GET /api/videos - Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ date: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/videos/:id - Get single video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/videos - Upload new video
router.post('/',
  authController.protect,
  videoUpload, // This already handles single file upload
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No video file uploaded' });
      }

      const newVideo = new Video({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        date: req.body.date || new Date(),
        filePath: req.file.path.replace(/\\/g, '/'),
        size: req.file.size,
        mimeType: req.file.mimetype
      });

      const savedVideo = await newVideo.save();
      res.status(201).json(savedVideo);
    } catch (error) {
      // Clean up if error occurs
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).json({ message: error.message });
    }
  }
);

// PUT /api/videos/:id - Update video
router.put('/:id',
  authController.protect,
  videoUpload, // This already handles single file upload
  async (req, res) => {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) {
        // Clean up new file if video not found
        if (req.file?.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ message: 'Video not found' });
      }

      // Update fields
      if (req.body.title) video.title = req.body.title;
      if (req.body.description) video.description = req.body.description;
      if (req.body.category) video.category = req.body.category;
      if (req.body.date) video.date = req.body.date;

      // Handle file update
      if (req.file) {
        // Delete old file
        if (fs.existsSync(video.filePath)) {
          fs.unlinkSync(video.filePath);
        }
        // Update with new file
        video.filePath = req.file.path.replace(/\\/g, '/');
        video.size = req.file.size;
        video.mimeType = req.file.mimetype;
      }

      const updatedVideo = await video.save();
      res.json(updatedVideo);
    } catch (error) {
      // Clean up if error occurs
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ message: error.message });
    }
  }
);

// DELETE /api/videos/:id - Delete video
router.delete('/:id',
  authController.protect,
  async (req, res) => {
    try {
      const video = await Video.findById(req.params.id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      // Delete file
      if (fs.existsSync(video.filePath)) {
        fs.unlinkSync(video.filePath);
      }

      await Video.findByIdAndDelete(req.params.id);
      res.json({ message: 'Video deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET /api/videos/:id/file - Stream video
router.get('/:id/file', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video || !video.filePath) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const filePath = path.resolve(video.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Video file not found' });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle partial content
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': video.mimeType,
      });
      
      file.pipe(res);
    } else {
      // Send full file
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': video.mimeType,
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;