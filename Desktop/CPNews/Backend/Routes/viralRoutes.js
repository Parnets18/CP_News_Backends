const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const viralController = require('../Controllers/viralController');

router.post('/',upload('virals').single('image'),viralController.createViral);
router.get('/',viralController.getVirals);
router.get('/:id',upload('virals').single('image'),viralController.getViralsById);
router.delete('/:id',viralController.deleteViral);

module.exports = router;
