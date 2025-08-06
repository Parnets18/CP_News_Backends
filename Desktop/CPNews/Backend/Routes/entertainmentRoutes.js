const express = require('express');
const router = express.Router();
const { createUploadMiddleware } = require('../middleware/uploads');
const entertainmentController = require('../Controllers/entertainmentController');
const authController = require('../Controllers/authController');

// Create upload middleware specific to entertainment category
const entertainmentUpload = createUploadMiddleware('entertainments');

// POST /api/entertainment - Create new entertainment entry (protected)
router.post('/',
  authController.protect,
  entertainmentUpload,
  entertainmentController.createEntertainment
);

// PUT /api/entertainment/:id - Update entertainment entry (protected)
router.put('/:id',
  authController.protect,
  entertainmentUpload,
  entertainmentController.updateEntertainment
);

// DELETE /api/entertainment/:id - Delete entertainment entry (protected)
router.delete('/:id',
  authController.protect,
  entertainmentController.deleteEntertainment
);

// GET /api/entertainment - Get all entertainment entries (public)
router.get('/', entertainmentController.getEntertainments);

// GET /api/entertainment/:id - Get specific entertainment entry (public)
router.get('/:id', entertainmentController.getEntertainmentById);

module.exports = router;