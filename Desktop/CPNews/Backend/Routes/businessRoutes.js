const express = require('express');
const router = express.Router();
const { createUploadMiddleware } = require('../middleware/uploads');
const businessController = require('../Controllers/businessController');
const authController = require('../Controllers/authController');

// Create the upload middleware for business category
const businessUpload = createUploadMiddleware('business');

// POST route - create new business item
router.post('/',
  authController.protect,
  businessUpload,
  businessController.createBusiness
);

// GET routes - retrieve business items
router.get('/', businessController.getBusinesses);
router.get('/:id', businessController.getBusinessById);

// PUT route - update business item
router.put('/:id',
  authController.protect,
  businessUpload,  // Use the same upload middleware as POST
  businessController.updateBusiness
);

// DELETE route - remove business item
router.delete('/:id',
  authController.protect,
  businessController.deleteBusiness
);

module.exports = router;