const express = require('express');
const router = express.Router();
const { createMultiUploadMiddleware } = require('../middleware/uploads');
const photoController = require('../Controllers/photoController');
const authController = require('../Controllers/authController');

// Create upload middleware for photos (max 10 images)
const photoUpload = createMultiUploadMiddleware('photos', 10);

// POST /api/photos - Create with multiple images
router.post('/',
  authController.protect,
  photoUpload,
  photoController.createPhoto
);

// PUT /api/photos/:id - Update with multiple images
router.put('/:id',
  authController.protect,
  photoUpload,
  photoController.updatePhoto
);

// DELETE /api/photos/:id - Delete
router.delete('/:id',
  authController.protect,
  photoController.deletePhoto
);

// GET routes
router.get('/', photoController.getPhotos);
router.get('/:id', photoController.getPhotoById);

module.exports = router;