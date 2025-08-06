const express = require('express');
const router = express.Router();
const { createUploadMiddleware } = require('../middleware/uploads');
const crimeController = require('../Controllers/crimeController');
const authController = require('../Controllers/authController');

// Create upload middleware specific to crimes category
const crimesUpload = createUploadMiddleware('crimes');

// POST /api/crimes - Create new crime report
router.post('/',
  authController.protect,
  crimesUpload,
  crimeController.createCrime
);

// GET /api/crimes - Get all crimes
router.get('/', crimeController.getCrimes);

// GET /api/crimes/:id - Get specific crime
router.get('/:id', crimeController.getCrimesById);

// PUT /api/crimes/:id - Update crime report
router.put('/:id',
  authController.protect,
  crimesUpload,
  crimeController.updateCrime
);

// DELETE /api/crimes/:id - Delete crime report
router.delete('/:id',
  authController.protect,
  crimeController.deleteCrime
);

module.exports = router;