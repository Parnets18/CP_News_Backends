const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const viralController = require('../Controllers/viralController');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, upload('virals').single('image'), viralController.createViral);
router.put('/:id', verifyToken, upload('virals').single('image'), viralController.updateViral);
router.delete('/:id', verifyToken, viralController.deleteViral);

router.get('/', viralController.getVirals);
router.get('/:id', viralController.getViralsById);

module.exports = router;
