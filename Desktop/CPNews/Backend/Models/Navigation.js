const mongoose = require('mongoose');

const navigationItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  icon: { type: String, required: false },
  activeIcon: { type: String, required: false },
  label: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['main', 'category', 'language', 'social'],
    default: 'category'
  },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Navigation', navigationItemSchema);