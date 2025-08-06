const express = require('express');
const router = express.Router();
const { createUploadMiddleware } = require('../middleware/uploads');
const worldController = require('../Controllers/worldController');
const authController = require('../Controllers/authController');

// Create upload middleware specific to world category
const worldUpload = createUploadMiddleware('world');

// Protected routes
router.post('/',
  authController.protect,
  worldUpload,
  worldController.createWorld
);

router.put('/:id',
  authController.protect,
  worldUpload,
  worldController.updateWorld
);

router.delete('/:id',
  authController.protect,
  worldController.deleteWorld
);

// Public routes
router.get('/', worldController.getWorlds);
router.get('/:id', worldController.getWorldById);

module.exports = router;