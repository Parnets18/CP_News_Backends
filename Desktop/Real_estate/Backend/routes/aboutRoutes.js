const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  createAboutCard,
  getAllAboutCards,
  updateAboutCard,
  deleteAboutCard,
} = require('../controllers/aboutController');

// Create a new About Card with image upload
router.post('/', upload('about').single('image'), createAboutCard);

// Retrieve all About Cards
router.get('/', getAllAboutCards);

// Update an existing About Card
router.put('/:id', upload('about').single('image'), updateAboutCard);

// Delete an About Card
router.delete('/:id', deleteAboutCard);

module.exports = router;