const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const mobilityController = require('../Controllers/mobilityController');

router.post('/', upload('mobility').single('image'), mobilityController.createMobility);
router.get('/', mobilityController.getMobilities);
router.get('/:id', upload('mobility').single('image'), mobilityController.getMobilityById);
router.delete('/:id', mobilityController.deleteMobility);

module.exports = router;
