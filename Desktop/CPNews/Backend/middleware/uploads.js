const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const createError = require('http-errors');

const mkdirAsync = promisify(fs.mkdir);
const accessAsync = promisify(fs.access);

const config = {
  fileTypes: {
    'image/jpeg': 'jpg',
    'image/avif': 'avif',
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov'
  },
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 1,
  uploadsBaseDir: 'uploads'
};

const getFileExtension = (mimetype) => {
  return config.fileTypes[mimetype] || 
         mimetype?.split('/')[1] || 
         'bin';
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const category = req.routeCategory || req.params?.category?.toLowerCase() || 'general';
      const dir = path.join(config.uploadsBaseDir, category);
      
      try {
        await accessAsync(dir, fs.constants.F_OK);
      } catch (err) {
        await mkdirAsync(dir, { recursive: true });
        console.log(`Created upload directory: ${dir}`);
      }
      
      cb(null, dir);
    } catch (err) {
      console.error('Directory creation error:', err);
      cb(createError(500, 'Failed to create upload directory'));
    }
  },
  filename: (req, file, cb) => {
    const extension = getFileExtension(file.mimetype);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const sanitizedOriginal = file.originalname.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    cb(null, `${uniqueSuffix}-${sanitizedOriginal}.${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file || !file.mimetype) {
    return cb(createError(400, 'Invalid file data received'));
  }

  const isValid = !!config.fileTypes[file.mimetype];
  
  if (!isValid) {
    const error = createError(400, 
      `Invalid file type. Allowed types: ${Object.keys(config.fileTypes).join(', ')}`
    );
    return cb(error, false);
  }
  
  cb(null, true);
};

const multerInstance = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: config.maxFileSize,
    files: config.maxFiles
  }
});

// For single file uploads
const createUploadMiddleware = (category) => {
  return (req, res, next) => {
    req.routeCategory = category;
    return multerInstance.single('image')(req, res, next);
  };
};

// For multiple file uploads
const createMultiUploadMiddleware = (category, maxCount = 10) => {
  return (req, res, next) => {
    req.routeCategory = category;
    return multerInstance.array('images', maxCount)(req, res, next);
  };
};

// For dynamic category routes
const dynamicUpload = (req, res, next) => {
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
    return next();
  }
  return multerInstance.single('image')(req, res, next);
};

module.exports = {
  multerInstance,
  createUploadMiddleware,
  createMultiUploadMiddleware,
  dynamicUpload
};