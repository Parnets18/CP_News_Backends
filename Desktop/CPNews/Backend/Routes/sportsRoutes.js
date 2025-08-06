const express = require('express');
const router = express.Router();
const { createUploadMiddleware } = require('../middleware/uploads');
const sportsController = require('../Controllers/sportsController');
const authController = require('../Controllers/authController');

// Create upload middleware specific to sports category
const sportsUpload = createUploadMiddleware('sports');

// POST /api/sports - Create new sports content (protected)
router.post('/',
  authController.protect,
  sportsUpload,
  sportsController.createSports
);

// PUT /api/sports/:id - Update sports content (protected)
router.put('/:id',
  authController.protect,
  sportsUpload,
  sportsController.updateSports
);

// DELETE /api/sports/:id - Delete sports content (protected)
router.delete('/:id',
  authController.protect,
  sportsController.deleteSports
);

// GET /api/sports - Get all sports content (public)
router.get('/', sportsController.getSports);

// GET /api/sports/:id - Get specific sports content (public)
router.get('/:id', sportsController.getSportsById);

module.exports = router;