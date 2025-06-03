const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const webController = require('../Controllers/webController');
const verifyToken = require('../middleware/verifyToken');
router.post('/', verifyToken, upload('web').single('image'), webController.createWeb);
router.get('/', webController.getWebs);
router.get('/:id', webController.getWebById);
router.put('/:id',verifyToken, upload('web').single('image'), webController.updateWeb);
router.delete('/:id', verifyToken, webController.deleteWeb);

module.exports = router;