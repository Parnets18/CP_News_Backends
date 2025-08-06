const express = require('express');
const router = express.Router();
const { createUploadMiddleware } = require('../middleware/uploads');
const realEstateController = require('../Controllers/realEstateController');
const authController = require('../Controllers/authController');

// Create upload middleware specific to realestate category
const realEstateUpload = createUploadMiddleware('realestate');

// POST /api/realestate - Create new real estate listing (protected)
router.post('/',
  authController.protect,
  realEstateUpload,
  realEstateController.createRealEstate
);

// PUT /api/realestate/:id - Update real estate listing (protected)
router.put('/:id',
  authController.protect,
  realEstateUpload,
  realEstateController.updateRealEstate
);

// DELETE /api/realestate/:id - Delete real estate listing (protected)
router.delete('/:id',
  authController.protect,
  realEstateController.deleteRealEstate
);

// GET /api/realestate - Get all real estate listings (public)
router.get('/', realEstateController.getRealEstates);

// GET /api/realestate/:id - Get specific real estate listing (public)
router.get('/:id', realEstateController.getRealEstateById);

module.exports = router;