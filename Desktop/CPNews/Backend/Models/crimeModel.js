const mongoose = require('mongoose');

const crimeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  tags: { type: String },
  date: { type: Date, default: Date.now },
  image: { type: String },
});

module.exports = mongoose.model('Crime', crimeSchema);
