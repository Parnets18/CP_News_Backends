const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  createGalleryItem,
  getAllGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem
} = require('../controllers/galleryController');

// Create
router.post(
  '/',
  upload('gallery').single('image'),
  createGalleryItem
);

// Read
router.get('/', getAllGalleryItems);
router.get('/:id', getGalleryItemById);

// Update
router.put(
  '/:id',
  upload('gallery').single('image'),
  updateGalleryItem
);

// Delete
router.delete('/:id', deleteGalleryItem);

module.exports = router;