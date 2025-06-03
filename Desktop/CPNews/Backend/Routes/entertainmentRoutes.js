

const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const entertainmentController = require('../Controllers/entertainmentController');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, upload('entertainments').single('image'), entertainmentController.createEntertainment);
router.get('/', entertainmentController.getEntertainments);
router.get('/:id', upload('entertainments').single('image'), entertainmentController.getEntertainmentById);
router.put('/:id', verifyToken, upload('entertainments').single('image'), entertainmentController.updateEntertainment);
router.delete('/:id', verifyToken, entertainmentController.deleteEntertainment);

module.exports = router;
