// models/ContactInfo.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  phoneAndEmail: {
    title: { type: String, default: 'Phone and Email' },
    content: { type: String, required: true },
  },
  officeAddress: {
    title: { type: String, default: 'Office Address' },
    content: { type: String, required: true },
  },
  visitHours: {
    title: { type: String, default: 'Visit Between' },
    content: { type: String, required: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
