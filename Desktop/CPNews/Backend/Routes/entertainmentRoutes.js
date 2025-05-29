

const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const entertainmentController = require('../Controllers/entertainmentController');

router.post('/', upload('entertainments').single('image'), entertainmentController.createEntertainment);
router.get('/', entertainmentController.getEntertainments);
router.get('/:id', upload('entertainments').single('image'), entertainmentController.getEntertainmentById);
router.delete('/:id', entertainmentController.deleteEntertainment);

module.exports = router;
