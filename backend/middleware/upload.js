const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan untuk menu
const menuStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/menus');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'menu-' + uniqueSuffix + ext);
  }
});

// Konfigurasi penyimpanan untuk tenant
const tenantStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/tenants');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'tenant-' + uniqueSuffix + ext);
  }
});

// Filter file gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diizinkan!'), false);
  }
};

// Upload middleware untuk menu
const uploadMenu = multer({ 
  storage: menuStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// Upload middleware untuk tenant
const uploadTenant = multer({ 
  storage: tenantStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = {
  uploadMenu,
  uploadTenant
}; 