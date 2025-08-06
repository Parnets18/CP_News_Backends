const express = require('express');
const router = express.Router();
const { createUploadMiddleware } = require('../middleware/uploads'); // Updated import
const categoryController = require('../Controllers/categoryController');
const authController = require('../Controllers/authController');

// Create upload middleware instance
const categoryUpload = createUploadMiddleware('categories');

// Dynamic routes for any category
router.post('/:category',
  authController.protect,
  categoryUpload,  // Using the pre-configured upload middleware
  categoryController.createItem
);

router.put('/:category/:id',
  authController.protect,
  categoryUpload,
  categoryController.updateItem
);

router.delete('/:category/:id',
  authController.protect,
  categoryController.deleteItem
);

// GET routes (public)
router.get('/:category', categoryController.getItems);
router.get('/:category/:id', categoryController.getItemById);

module.exports = router;