const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const sportsController = require('../Controllers/sportsController');

router.post('/', upload('sports').single('image'), sportsController.createSports);
router.get('/', sportsController.getSports);
router.get('/:id', sportsController.getSportsById);
router.put('/:id', upload('sports').single('image'), sportsController.updateSports);
router.delete('/:id', sportsController.deleteSports);

module.exports = router;