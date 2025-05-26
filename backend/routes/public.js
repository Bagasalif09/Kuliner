const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const apiKeyMiddleware = require('../middleware/apikey');

// Middleware untuk semua route publik
router.use(apiKeyMiddleware);

// GET /api/public/tenants - Mendapatkan semua tenant (publik)
router.get('/tenants', adminController.getAllTenantsPublic);

module.exports = router; 