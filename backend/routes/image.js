const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { uploadMenu, uploadTenant } = require('../middleware/upload');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const apiKeyMiddleware = require('../middleware/apikey');

// Upload gambar menu (admin)
router.post('/menu/:id', auth, admin, uploadMenu.single('image'), imageController.uploadMenuImage);

// Upload gambar tenant (admin)
router.post('/tenant/:id', auth, admin, uploadTenant.single('image'), imageController.uploadTenantImage);

// Update informasi tenant (admin)
router.put('/tenant/:id/info', auth, admin, imageController.updateTenantInfo);

// Dapatkan informasi tenant (public)
router.get('/tenant/:id', apiKeyMiddleware, imageController.getTenantInfo);

module.exports = router; 