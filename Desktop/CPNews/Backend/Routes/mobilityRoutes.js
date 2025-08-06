const express = require('express');
const router = express.Router();
const { createUploadMiddleware } = require('../middleware/uploads');
const mobilityController = require('../Controllers/mobilityController');
const authController = require('../Controllers/authController');

// Create upload middleware specific to mobility category
const mobilityUpload = createUploadMiddleware('mobility');

// POST /api/mobility - Create new mobility entry (protected)
router.post('/',
  authController.protect,
  mobilityUpload,
  mobilityController.createMobility
);

// PUT /api/mobility/:id - Update mobility entry (protected)
router.put('/:id',
  authController.protect,
  mobilityUpload,
  mobilityController.updateMobility
);

// DELETE /api/mobility/:id - Delete mobility entry (protected)
router.delete('/:id',
  authController.protect,
  mobilityController.deleteMobility
);

// GET /api/mobility - Get all mobility entries (public)
router.get('/', mobilityController.getMobilities);

// GET /api/mobility/:id - Get specific mobility entry (public)
router.get('/:id', mobilityController.getMobilityById);

module.exports = router;