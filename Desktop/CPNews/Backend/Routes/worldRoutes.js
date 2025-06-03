const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const worldController = require('../Controllers/worldController');
const verifyToken = require('../middleware/verifyToken');

router.post('/',verifyToken, upload('world').single('image'), worldController.createWorld);
router.get('/', worldController.getWorlds);
router.get('/:id', worldController.getWorldById);
router.put('/:id',verifyToken, upload('world').single('image'), worldController.updateWorld);
router.delete('/:id',verifyToken, worldController.deleteWorld);

module.exports = router;