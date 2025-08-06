const Web = require('../Models/WebModal');

exports.createWeb = async (req, res) => {
  try {
    const { title, description, tags, date } = req.body;
    // Store only the relative path without the 'uploads' prefix
    const image = req.file ? `web/${req.file.filename}` : '';

    const newWeb = await Web.create({
      title,
      description,
      tags,
      date,
      image,
    });
    res.status(201).json(newWeb);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWeb = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, date } = req.body;
    
    // Get the current document first to clean up old image
    const existingWeb = await Web.findById(id);
    
    const image = req.file ? `web/${req.file.filename}` : undefined;
    
    const updatedWeb = await Web.findByIdAndUpdate(
      id,
      {
        title,
        description,
        tags,
        date,
        ...(image && { image }),
      },
      { new: true }
    );

    // Delete old image file if it exists and we're uploading a new one
    if (req.file && existingWeb.image) {
      const fs = require('fs');
      const path = require('path');
      const oldImagePath = path.join(__dirname, '../uploads', existingWeb.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Error deleting old image:', err);
      });
    }

    res.json(updatedWeb);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWebs = async (req, res) => {
  try {
    const webs = await Web.find().sort({ date: -1 });
    // Transform image paths to include the /uploads prefix for client
    const websWithPublicUrls = webs.map(web => ({
      ...web.toObject(),
      image: web.image ? `/uploads/${web.image}` : null
    }));
    res.json(websWithPublicUrls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWebById = async (req, res) => {
  try {
    const web = await Web.findById(req.params.id);
    if (!web) {
      return res.status(404).json({ message: 'Web report not found' });
    }
    // Transform image path for client
    const webWithPublicUrl = {
      ...web.toObject(),
      image: web.image ? `/uploads/${web.image}` : null
    };
    res.json(webWithPublicUrl);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteWeb = async (req, res) => {
  try {
    const { id } = req.params;
    const web = await Web.findById(id);
    
    if (!web) {
      return res.status(404).json({ message: 'Web report not found' });
    }

    // Delete associated image file if it exists
    if (web.image) {
      const fs = require('fs');
      const path = require('path');
      const imagePath = path.join(__dirname, '../uploads', web.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    await Web.findByIdAndDelete(id);
    res.json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
