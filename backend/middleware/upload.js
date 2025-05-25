const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads');
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `menu-${uniqueSuffix}${ext}`);
  }
});

// Filter file gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValidType = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMimeType = allowedTypes.test(file.mimetype.split('/')[1].toLowerCase());
  
  if (isValidType && isValidMimeType) {
    return cb(null, true);
  }
  
  cb(new Error('Format file harus jpeg, jpg, png, atau webp'));
};

// Membuat middleware multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  }
});

module.exports = upload; 