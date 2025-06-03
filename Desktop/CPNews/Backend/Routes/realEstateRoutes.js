const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const realEstateController = require('../Controllers/realEstateController');
const verifyToken = require('../middleware/verifyToken');
router.post('/', verifyToken, upload('realestate').single('image'), realEstateController.createRealEstate);
router.get('/', realEstateController.getRealEstates);
router.get('/:id', upload('realestate').single('image'), realEstateController.getRealEstateById);
router.put('/:id', verifyToken, upload('realestate').single('image'), realEstateController.updateRealEstate)
router.delete('/:id',verifyToken, realEstateController.deleteRealEstate);

module.exports = router;
