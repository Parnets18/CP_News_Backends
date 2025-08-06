// const NewsArticle = require('../Models/NewsArticle');
// const AppError = require('../Utils/appError');
// const catchAsync = require('../Utils/catchAsync');
// const fs = require('fs');
// const path = require('path');
// const { promisify } = require('util');

// const unlinkAsync = promisify(fs.unlink);

// exports.getNewsArticles = catchAsync(async (req, res, next) => {
//   // Filtering
//   const queryObj = { ...req.query };
//   const excludedFields = ['page', 'sort', 'limit', 'fields'];
//   excludedFields.forEach(el => delete queryObj[el]);

//   // Advanced filtering
//   let queryStr = JSON.stringify(queryObj);
//   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
//   let query = NewsArticle.find(JSON.parse(queryStr)).populate('author');

//   // Sorting
//   if (req.query.sort) {
//     const sortBy = req.query.sort.split(',').join(' ');
//     query = query.sort(sortBy);
//   } else {
//     query = query.sort('-createdAt');
//   }

//   // Field limiting
//   if (req.query.fields) {
//     const fields = req.query.fields.split(',').join(' ');
//     query = query.select(fields);
//   }

//   // Pagination
//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 10;
//   const skip = (page - 1) * limit;
//   const total = await NewsArticle.countDocuments(JSON.parse(queryStr));

//   query = query.skip(skip).limit(limit);

//   const newsArticles = await query;

//   res.status(200).json({
//     status: 'success',
//     results: newsArticles.length,
//     total,
//     totalPages: Math.ceil(total / limit),
//     currentPage: page,
//     data: {
//       data: newsArticles
//     }
//   });
// });

// exports.getNewsArticle = catchAsync(async (req, res, next) => {
//   const newsArticle = await NewsArticle.findById(req.params.id).populate('author');

//   if (!newsArticle) {
//     return next(new AppError('No news article found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       data: newsArticle
//     }
//   });
// });

// exports.createNewsArticle = catchAsync(async (req, res, next) => {
//   // Set author to current user
//   req.body.author = req.user.id;
  
//   // Handle image path if uploaded
//   if (req.file) {
//     req.body.image = req.file.filename;
//   } else {
//     req.body.image = 'default.jpg';
//   }

//   // Handle tags if provided (assuming tags come as comma-separated string)
//   if (req.body.tags && typeof req.body.tags === 'string') {
//     req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
//   }

//   const newsArticle = await NewsArticle.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       data: newsArticle
//     }
//   });
// });

// exports.updateNewsArticle = catchAsync(async (req, res, next) => {
//   // Handle image update if new file uploaded
//   if (req.file) {
//     req.body.image = req.file.filename;
    
//     // Delete old image if it exists and isn't the default
//     const existingArticle = await NewsArticle.findById(req.params.id);
//     if (existingArticle && existingArticle.image && existingArticle.image !== 'default.jpg') {
//       const imagePath = path.join(__dirname, '../uploads/news-articles', existingArticle.image);
//       try {
//         await unlinkAsync(imagePath);
//       } catch (err) {
//         console.error('Error deleting old image:', err);
//       }
//     }
//   }

//   // Handle tags update if provided
//   if (req.body.tags && typeof req.body.tags === 'string') {
//     req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
//   }

//   const newsArticle = await NewsArticle.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     {
//       new: true,
//       runValidators: true
//     }
//   ).populate('author');

//   if (!newsArticle) {
//     return next(new AppError('No news article found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       data: newsArticle
//     }
//   });
// });

// exports.deleteNewsArticle = catchAsync(async (req, res, next) => {
//   const newsArticle = await NewsArticle.findByIdAndDelete(req.params.id);

//   if (!newsArticle) {
//     return next(new AppError('No news article found with that ID', 404));
//   }

//   // Delete associated image if it exists and isn't the default
//   if (newsArticle.image && newsArticle.image !== 'default.jpg') {
//     const imagePath = path.join(__dirname, '../uploads/news-articles', newsArticle.image);
//     try {
//       await unlinkAsync(imagePath);
//     } catch (err) {
//       console.error('Error deleting image:', err);
//     }
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

// exports.uploadNewsArticleImage = catchAsync(async (req, res, next) => {
//   if (!req.file) {
//     return next(new AppError('Please upload an image', 400));
//   }

//   // Get existing article to check for old image
//   const existingArticle = await NewsArticle.findById(req.params.id);
//   if (!existingArticle) {
//     return next(new AppError('No news article found with that ID', 404));
//   }

//   // Delete old image if it exists and isn't the default
//   if (existingArticle.image && existingArticle.image !== 'default.jpg') {
//     const oldImagePath = path.join(__dirname, '../uploads/news-articles', existingArticle.image);
//     try {
//       await unlinkAsync(oldImagePath);
//     } catch (err) {
//       console.error('Error deleting old image:', err);
//     }
//   }

//   // Update with new image
//   const updatedArticle = await NewsArticle.findByIdAndUpdate(
//     req.params.id,
//     { 
//       image: req.file.filename,
//       updatedAt: Date.now()
//     },
//     { new: true, runValidators: true }
//   ).populate('author');

//   res.status(200).json({
//     status: 'success',
//     data: {
//       data: updatedArticle
//     }
//   });
// });