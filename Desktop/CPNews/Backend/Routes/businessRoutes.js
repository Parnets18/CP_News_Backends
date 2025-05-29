const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const businessController = require('../Controllers/businessController');

router.post('/', upload('business').single('image'), businessController.createBusiness);
router.get('/', businessController.getBusinesses);
router.get('/:id', businessController.getBusinessById);
router.put('/:id', upload('business').single('image'), businessController.updateBusiness);
router.delete('/:id', businessController.deleteBusiness);

module.exports = router;