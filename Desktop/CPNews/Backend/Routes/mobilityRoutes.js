const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const mobilityController = require('../Controllers/mobilityController');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, upload('mobility').single('image'), mobilityController.createMobility);
router.get('/',  mobilityController.getMobilities);
router.get('/:id', upload('mobility').single('image'), mobilityController.getMobilityById);
router.put('/:id', verifyToken, upload('mobility').single('image'), mobilityController.updateMobility);
router.delete('/:id', verifyToken, mobilityController.deleteMobility);

module.exports = router;
