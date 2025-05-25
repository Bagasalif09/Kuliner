const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const apiKeyMiddleware = require('../middleware/apikey');

// Middleware API key
router.use(apiKeyMiddleware);

// GET /api/tenants - Mendapatkan semua tenant
router.get('/', tenantController.getAllTenants);

// GET /api/tenants/:id - Mendapatkan tenant berdasarkan ID
router.get('/:id', tenantController.getTenantById);

// GET /api/tenants/:id/menu - Mendapatkan menu berdasarkan tenant_id
router.get('/:id/menu', tenantController.getTenantMenu);

module.exports = router; 