const express = require('express');
const router = express.Router();
const path = require('path');
const { createUploadMiddleware } = require('../middleware/uploads');
const webController = require('../Controllers/webController');
const authController = require('../Controllers/authController');

// Create upload middleware specific to web category
const webUpload = createUploadMiddleware('web');

// Serve static files from the web uploads directory
router.use('/images', express.static(path.join(__dirname, '../uploads/web')));

// POST /api/web - Create new web content (protected)
router.post('/',
  authController.protect,
  webUpload,
  webController.createWeb
);

// PUT /api/web/:id - Update web content (protected)
router.put('/:id',
  authController.protect,
  webUpload,
  webController.updateWeb
);

// DELETE /api/web/:id - Delete web content (protected)
router.delete('/:id',
  authController.protect,
  webController.deleteWeb
);

// GET /api/web - Get all web content (public)
router.get('/', webController.getWebs);

// GET /api/web/:id - Get specific web content (public)
router.get('/:id', webController.getWebById);

module.exports = router;