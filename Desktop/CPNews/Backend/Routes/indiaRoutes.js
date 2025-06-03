const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const indiaController = require('../controllers/indiaController');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, upload('india').single('image'), indiaController.createIndia);
router.get('/', indiaController.getIndias);
router.get('/:id', indiaController.getIndiaById);
router.put('/:id', verifyToken, upload('india').single('image'), indiaController.updateIndia);
router.delete('/:id', verifyToken, indiaController.deleteIndia);

module.exports = router;
