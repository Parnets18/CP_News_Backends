const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { 
  createBanner,
  getAllBanners,
  updateBanner,
  deleteBanner
} = require('../controllers/bannerControllers');

// Create new banner
router.post('/', upload('banner').fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 }
]), createBanner);

// Get all banners
router.get('/', getAllBanners);

// Update banner
router.put('/:id', upload('banner').fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 }
]), updateBanner);

// Delete banner
router.delete('/:id', deleteBanner);

module.exports = router;