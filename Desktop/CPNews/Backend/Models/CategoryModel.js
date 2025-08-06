const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  tags: { type: String },
  date: { type: Date, default: Date.now },
  image: { type: String },
  category: { type: String, required: true } // This will store the category name
}, { timestamps: true });

// Create a dynamic model based on category name
module.exports = (category) => {
  return mongoose.model(category, categorySchema);
};