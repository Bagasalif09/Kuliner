const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');
const tenantController = require('../controllers/tenantController');

// Middleware untuk semua route admin
router.use(auth, admin);

// GET /api/admin/tenants - Mendapatkan semua tenant
router.get('/tenants', adminController.getAllTenants);

// GET /api/admin/tenants/:id - Mendapatkan tenant berdasarkan ID
router.get('/tenants/:id', adminController.getTenantById);

// GET /api/admin/menus - Mendapatkan semua menu dari semua tenant
router.get('/menus', adminController.getAllMenus);

// GET /api/admin/menus/:id - Mendapatkan menu berdasarkan ID
router.get('/menus/:id', adminController.getMenuById);

// POST /api/admin/menus - Menambahkan menu baru dengan gambar (optional)
router.post('/menus', upload.single('image'), adminController.addMenu);

// PUT /api/admin/menus/:id - Memperbarui menu dengan gambar (optional)
router.put('/menus/:id', upload.single('image'), adminController.updateMenu);

// DELETE /api/admin/menus/:id - Menghapus menu
router.delete('/menus/:id', adminController.deleteMenu);

// POST /api/admin/tenants - Membuat tenant baru
router.post('/tenants', upload.single('banner'), tenantController.createTenant);

// PUT /api/admin/tenants/:id - Memperbarui tenant
router.put('/tenants/:id', upload.single('banner'), tenantController.updateTenant);

// DELETE /api/admin/tenants/:id - Menghapus tenant
router.delete('/tenants/:id', tenantController.deleteTenant);

module.exports = router; 