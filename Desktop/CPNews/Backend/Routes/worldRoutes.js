const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const worldController = require('../Controllers/worldController');

router.post('/', upload('world').single('image'), worldController.createWorld);
router.get('/', worldController.getWorlds);
router.get('/:id', worldController.getWorldById);
router.put('/:id', upload('world').single('image'), worldController.updateWorld);
router.delete('/:id', worldController.deleteWorld);

module.exports = router;