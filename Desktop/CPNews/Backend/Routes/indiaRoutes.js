const express = require('express');
const router = express.Router();
const { createUploadMiddleware } = require('../middleware/uploads');
const indiaController = require('../Controllers/indiaController');
const authController = require('../Controllers/authController');

// Create upload middleware specific to india category
const indiaUpload = createUploadMiddleware('india');

// POST /api/india - Create new india content (protected)
router.post('/',
  authController.protect,
  indiaUpload,
  indiaController.createIndia
);

// PUT /api/india/:id - Update india content (protected)
router.put('/:id',
  authController.protect,
  indiaUpload,
  indiaController.updateIndia
);

// DELETE /api/india/:id - Delete india content (protected)
router.delete('/:id',
  authController.protect,
  indiaController.deleteIndia
);

// GET /api/india - Get all india content (public)
router.get('/', indiaController.getIndias);

// GET /api/india/:id - Get specific india content (public)
router.get('/:id', indiaController.getIndiaById);

module.exports = router;