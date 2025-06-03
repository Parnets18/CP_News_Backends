const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Politics', 'Sports', 'Technology', 'Health', 'Entertainment', 'Business', 'Science', 'Education']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  filePath: {
    type: String,
    required: true
  },
  thumbnailPath: {
    type: String
  },
  duration: {
    type: Number // in seconds
  },
  size: {
    type: Number // in bytes
  },
  mimeType: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
videoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;