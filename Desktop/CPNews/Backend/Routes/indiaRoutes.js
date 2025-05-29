const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const indiaController = require('../controllers/indiaController');

router.post('/', upload('india').single('image'), indiaController.createIndia);
router.get('/', indiaController.getIndias);
router.get('/:id', indiaController.getIndiaById);
router.delete('/:id', indiaController.deleteIndia);

module.exports = router;
