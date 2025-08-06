// const express = require('express');
// const router = express.Router();
// const newsController = require('../Controllers/newsController');
// const authController = require('../Controllers/authController');
// const upload = require('../middleware/uploads');
// const path = require('path');
// // const upload = require('../middleware/uploads');

// // Serve static files from the news-articles directory
// router.use('/images', express.static(path.join(__dirname, '../uploads/news-articles')));

// // Protect all routes after this middleware
// router.use(authController.protect);

// router.post('/',
//   authController.protect,
//   upload,
//   categoryController.createItem // Use categoryController method instead
// );

// router.route('/:id')
//   .get(newsController.getNewsArticle)
//   .patch(
//     upload('news-articles').single('image'),
//     newsController.updateNewsArticle
//   )
//   .delete(newsController.deleteNewsArticle);

// // Separate endpoint for image upload only (if needed)
// router.route('/:id/image')
//   .put(
//     upload('news-articles').single('image'),
//     newsController.uploadNewsArticleImage
//   );

// module.exports = router;