const express = require('express');
const router = express.Router();
const { createUploadMiddleware } = require('../middleware/uploads');
const viralController = require('../Controllers/viralController');
const authController = require('../Controllers/authController');

// Create upload middleware specific to virals category
const viralUpload = createUploadMiddleware('virals');

// POST /api/virals - Create new viral content (protected)
router.post('/',
  authController.protect,
  viralUpload,
  viralController.createViral
);

// PUT /api/virals/:id - Update viral content (protected)
router.put('/:id',
  authController.protect,
  viralUpload,
  viralController.updateViral
);

// DELETE /api/virals/:id - Delete viral content (protected)
router.delete('/:id',
  authController.protect,
  viralController.deleteViral
);

// GET /api/virals - Get all viral content (public)
router.get('/', viralController.getVirals);

// GET /api/virals/:id - Get specific viral content (public)
router.get('/:id', viralController.getViralsById);

module.exports = router;