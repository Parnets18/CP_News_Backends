const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const crimeController = require('../Controllers/crimeController');
const verifyToken = require('../middleware/verifyToken');
// POST /api/crimes
router.post('/', verifyToken, 
  upload('crimes').single('image'), // middleware for file upload
  crimeController.createCrime        // controller function
);

// Other routes
router.get('/', crimeController.getCrimes);
router.get('/:id', crimeController.getCrimesById);
router.put('/:id', verifyToken, upload('crimes').single('image'), crimeController.updateCrime);
router.delete('/:id', verifyToken, crimeController.deleteCrime);

module.exports = router;