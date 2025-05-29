const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const realEstateController = require('../Controllers/realEstateController');

router.post('/', upload('realestate').single('image'), realEstateController.createRealEstate);
router.get('/', realEstateController.getRealEstates);
router.get('/:id', upload('realestate').single('image'), realEstateController.getRealEstateById);
router.delete('/:id', realEstateController.deleteRealEstate);

module.exports = router;
