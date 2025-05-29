const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const mkdirAsync = promisify(fs.mkdir);
const accessAsync = promisify(fs.access);

// Supported file types with extensions mapping
const FILE_TYPE_MAP = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov'
};

const storage = (folderName) => multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const dir = path.join('uploads', folderName);
      
      // Check if directory exists, if not create it
      try {
        await accessAsync(dir, fs.constants.F_OK);
      } catch (err) {
        await mkdirAsync(dir, { recursive: true });
      }
      
      cb(null, dir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const extension = FILE_TYPE_MAP[file.mimetype] || path.extname(file.originalname).substring(1);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}.${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  const isValid = !!FILE_TYPE_MAP[file.mimetype];
  const error = isValid ? null : new Error(`Invalid file type. Only ${Object.keys(FILE_TYPE_MAP).map(t => t.split('/')[1]).join(', ')} are allowed.`);
  cb(error, isValid);
};

const upload = (folderName) => multer({
  storage: storage(folderName),
  fileFilter,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Limit to single file
  }
});

module.exports = upload;