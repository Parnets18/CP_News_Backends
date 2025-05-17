const Gallery = require('../model/Gallery');

// Create gallery item
const createGalleryItem = async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title || !req.file) {
      return res.status(400).json({ 
        message: 'Both title and image are required' 
      });
    }

    const newItem = new Gallery({
      title,
      image: req.file.path
    });

    const savedItem = await newItem.save();
    res.status(201).json({
      ...savedItem._doc,
      image: `${process.env.BASE_URL}/${savedItem.image}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all items
const getAllGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items.map(item => ({
      ...item._doc,
      image: `${process.env.BASE_URL}/${item.image}`
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single item
const getGalleryItemById = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({
      ...item._doc,
      image: `${process.env.BASE_URL}/${item.image}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item
const updateGalleryItem = async (req, res) => {
  try {
    const updates = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.file) updates.image = req.file.path;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    const updatedItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    
    res.json({
      ...updatedItem._doc,
      image: `${process.env.BASE_URL}/${updatedItem.image}`
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete item
const deleteGalleryItem = async (req, res) => {
  try {
    const deletedItem = await Gallery.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createGalleryItem,
  getAllGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem
};