const express = require('express');
const router = express.Router();
const Navigation = require('../Models/Navigation');
const { authMiddleware } = require('../Controllers/authController'); // Destructured import

// Get all navigation items
router.get('/', async (req, res) => {
  try {
    const items = await Navigation.find().sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get navigation items by type
router.get('/type/:type', async (req, res) => {
  try {
    const items = await Navigation.find({ 
      type: req.params.type, 
      isActive: true 
    }).sort({ order: 1, createdAt: 1 });
    
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new navigation item (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const item = new Navigation({
      name: req.body.name,
      path: req.body.path,
      icon: req.body.icon,
      activeIcon: req.body.activeIcon,
      label: req.body.label,
      type: req.body.type,
      order: req.body.order || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });

    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a navigation item (protected)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Navigation.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Update fields
    const updatableFields = ['name', 'path', 'icon', 'activeIcon', 'label', 'type', 'order', 'isActive'];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    item.updatedAt = Date.now();
    const updatedItem = await item.save();
    
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a navigation item (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Navigation.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;