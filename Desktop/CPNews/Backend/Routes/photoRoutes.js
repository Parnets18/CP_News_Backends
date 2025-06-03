const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const photoController = require('../Controllers/photoController');
const verifyToken = require('../middleware/verifyToken');

// Limit to 10 images max per upload
router.post('/',verifyToken, upload('photo').array('images', 10), photoController.createPhoto);
router.get('/', photoController.getPhotos);
router.get('/:id', photoController.getPhotoById);
router.put('/:id',verifyToken, upload('photo').array('images', 10), photoController.updatePhoto);
router.delete('/:id',verifyToken, photoController.deletePhoto);

module.exports = router;