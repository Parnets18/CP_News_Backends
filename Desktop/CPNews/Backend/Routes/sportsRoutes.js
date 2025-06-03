const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const sportsController = require('../Controllers/sportsController');
const verifyToken = require('../middleware/verifyToken');
router.post('/',verifyToken, upload('sports').single('image'), sportsController.createSports);
router.get('/',  sportsController.getSports);
router.get('/:id', sportsController.getSportsById);
router.put('/:id',verifyToken, upload('sports').single('image'), sportsController.updateSports);
router.delete('/:id', verifyToken, sportsController.deleteSports);

module.exports = router;