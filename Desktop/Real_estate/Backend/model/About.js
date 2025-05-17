const mongoose = require('mongoose');

const aboutCardSchema = new mongoose.Schema({
  image: {
    type: String,
    required: false, // optional, since new cards may not have it initially
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  points: {
    type: [String], // array of bullet points
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('AboutCard', aboutCardSchema);
