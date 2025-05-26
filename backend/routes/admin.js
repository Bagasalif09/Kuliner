const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Middleware untuk semua route admin
router.use(auth, admin);

// GET /api/admin/tenants - Mendapatkan semua tenant
router.get('/tenants', adminController.getAllTenants);

// GET /api/admin/menus - Mendapatkan semua menu dari semua tenant
router.get('/menus', adminController.getAllMenus);

// GET /api/admin/menus/:id - Mendapatkan menu berdasarkan ID
router.get('/menus/:id', adminController.getMenuById);

// POST /api/admin/menus - Menambahkan menu baru
router.post('/menus', adminController.addMenu);

// PUT /api/admin/menus/:id - Memperbarui menu
router.put('/menus/:id', adminController.updateMenu);

// DELETE /api/admin/menus/:id - Menghapus menu
router.delete('/menus/:id', adminController.deleteMenu);

module.exports = router; 