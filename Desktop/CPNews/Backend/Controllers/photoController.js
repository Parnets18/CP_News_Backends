const Photo = require('../Models/photoModal');

exports.createPhoto = async (req, res) => {
  try {
    const { title, description, category, date } = req.body;
    
    // Validate image count
    if (req.files && req.files.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 images allowed per photo' });
    }
    
    // Get array of file paths if files were uploaded
    const images = req.files ? req.files.map(file => file.path) : [];
    
    const newPhoto = await Photo.create({
      title,
      description,
      category,
      date,
      images,
    });
    
    res.status(201).json(newPhoto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, date } = req.body;
    
    // Validate image count
    if (req.files && req.files.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 images allowed per photo' });
    }
    
    // Get array of new file paths if files were uploaded
    const newImages = req.files ? req.files.map(file => file.path) : undefined;
    
    const updateData = {
      title,
      description,
      category,
      date,
    };
    
    // Only add images to update if new images were uploaded
    if (newImages) {
      // Option 1: Replace all images
      updateData.images = newImages;
      
      // Option 2: Append new images to existing ones (check total doesn't exceed 10)
      // const existingPhoto = await Photo.findById(id);
      // const totalImages = existingPhoto.images.length + newImages.length;
      // if (totalImages > 10) {
      //   return res.status(400).json({ error: 'Total images cannot exceed 10' });
      // }
      // updateData.images = [...existingPhoto.images, ...newImages];
    }
    
    const updatedPhoto = await Photo.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    res.json(updatedPhoto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rest of your controller methods remain the same
exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ date: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.json(photo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    await Photo.findByIdAndDelete(id);
    res.json({ message: 'Photo deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};