const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const businessController = require('../Controllers/businessController');
const verifyToken = require('../middleware/verifyToken');
router.post('/', verifyToken, upload('business').single('image'), businessController.createBusiness);
router.get('/', businessController.getBusinesses);
router.get('/:id', businessController.getBusinessById);
router.put('/:id', verifyToken, upload('business').single('image'), businessController.updateBusiness);

router.delete('/:id', verifyToken, businessController.deleteBusiness);

module.exports = router;