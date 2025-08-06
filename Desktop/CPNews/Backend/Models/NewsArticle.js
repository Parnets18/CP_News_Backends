// const mongoose = require('mongoose');

// const newsArticleSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'A news article must have a title'],
//     trim: true,
//     maxlength: [200, 'A title must have less or equal than 200 characters'],
//     minlength: [10, 'A title must have more or equal than 10 characters']
//   },
//   content: {
//     type: String,
//     required: [true, 'A news article must have content']
//   },
//   image: {
//     type: String,
//     default: 'default.jpg'
//   },
//   category: {
//     type: String,
//     required: [true, 'A news article must belong to a category'],
//     enum: {
//       values: ['politics', 'technology', 'sports', 'business', 'entertainment', 'health', 'science', 'world'],
//       message: 'Category is either: politics, technology, sports, business, entertainment, health, science, world'
//     }
//   },
//   author: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User',
//     required: [true, 'A news article must have an author']
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now()
//   },
//   updatedAt: {
//     type: Date
//   },
//   status: {
//     type: String,
//     enum: ['draft', 'published', 'archived'],
//     default: 'draft'
//   },
//   slug: String,
//   tags: [String]
// }, {
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Indexes
// newsArticleSchema.index({ slug: 1 });

// // Document middleware
// newsArticleSchema.pre('save', function(next) {
//   this.slug = this.title.toLowerCase().replace(/ /g, '-');
//   next();
// });

// const NewsArticle = mongoose.model('NewsArticle', newsArticleSchema);

// module.exports = NewsArticle;