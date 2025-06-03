const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: [String] }, 
  date: { type: Date, default: Date.now },
  images: { type: [String] },
});

module.exports = mongoose.model('Photo', photoSchema);