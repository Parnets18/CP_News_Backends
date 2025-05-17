
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = (folderName) => multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `uploads/${folderName}`;
    fs.mkdirSync(dir, { recursive: true }); // Ensure folder exists
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = (folderName) => multer({
  storage: storage(folderName),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
