const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads')('videos');
const Video = require('../Models/Video');
const fs = require('fs');
const path = require('path');
const verifyToken = require('../middleware/verifyToken');

// Get all videos
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    const videos = await Video.find(query).sort({ date: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single video
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

// Upload new video
router.post('/', verifyToken, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const { title, description, category, date } = req.body;
    
    const newVideo = new Video({
      title,
      description,
      category,
      date: date || new Date(),
      filePath: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype
      // You can add thumbnail generation and duration extraction here if needed
    });

    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', verifyToken, upload.single('video'), async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update metadata if present
    const { title, description, category, date } = req.body;
    if (title) video.title = title;
    if (description) video.description = description;
    if (category) video.category = category;
    if (date) video.date = date;

    // If new file uploaded, replace old one
    if (req.file) {
      // Delete old file
      if (fs.existsSync(video.filePath)) {
        fs.unlinkSync(video.filePath);
      }

      // Set new file
      video.filePath = req.file.path;
      video.size = req.file.size;
      video.mimeType = req.file.mimetype;
    }

    video.updatedAt = new Date();
    const updatedVideo = await video.save();
    res.json(updatedVideo);
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ message: err.message });
  }
});



// Update video (metadata only)
// router.put('/:id',verifyToken, async (req, res) => {
//   try {
//     // Debugging logs
//     console.log('Headers:', req.headers);
//     console.log('Raw body:', req.body);

//     // Check content type
//     if (!req.is('application/json')) {
//       return res.status(415).json({
//         success: false,
//         message: 'Unsupported Media Type - Expected application/json'
//       });
//     }

//     // Check body exists and is object
//     if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Request body must be a non-empty JSON object'
//       });
//     }

//     const { title, description, category, date } = req.body;
    
//     // Build update object dynamically
//     const updateData = { updatedAt: new Date() };
//     const validFields = ['title', 'description', 'category', 'date'];
    
//     validFields.forEach(field => {
//       if (req.body[field] !== undefined) {
//         updateData[field] = req.body[field];
//       }
//     });

//     // Validate at least one field was provided
//     if (Object.keys(updateData).length === 1) { // only updatedAt
//       return res.status(400).json({
//         success: false,
//         message: 'At least one update field required: title, description, category, or date'
//       });
//     }

//     const updatedVideo = await Video.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedVideo) {
//       return res.status(404).json({
//         success: false,
//         message: 'Video not found'
//       });
//     }

//     res.json({
//       success: true,
//       data: updatedVideo
//     });
//   } catch (error) {
//     console.error('Update error:', error);
    
//     // Handle specific error types
//     let status = 400;
//     let message = error.message;
    
//     if (error.name === 'CastError') {
//       status = 400;
//       message = 'Invalid video ID format';
//     } else if (error.name === 'ValidationError') {
//       status = 422;
//       message = Object.values(error.errors).map(val => val.message).join(', ');
//     }
    
//     res.status(status).json({
//       success: false,
//       message: message
//     });
//   }
// });

// Replace video file
// router.put('/:id/file', verifyToken, upload.single('video'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No video file uploaded' });
//     }

//     const video = await Video.findById(req.params.id);
//     if (!video) {
//       return res.status(404).json({ message: 'Video not found' });
//     }

//     // Delete old file
//     if (fs.existsSync(video.filePath)) {
//       fs.unlinkSync(video.filePath);
//     }

//     // Update with new file
//     video.filePath = req.file.path;
//     video.size = req.file.size;
//     video.mimeType = req.file.mimetype;
//     video.updatedAt = new Date();

//     const updatedVideo = await video.save();
//     res.json(updatedVideo);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Delete video
router.delete('/:id', verifyToken, async (req, res) => {
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
});

// Serve video file
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

    const fileSize = fs.statSync(filePath).size;
    const range = req.headers.range;

    if (range) {
      // Handle range requests for streaming
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': video.mimeType,
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // Full file download
      const head = {
        'Content-Length': fileSize,
        'Content-Type': video.mimeType,
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;              