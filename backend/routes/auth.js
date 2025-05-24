const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Route login - POST /api/auth/login
router.post('/login', authController.login);

// Route ubah password - PUT /api/auth/change-password (perlu autentikasi)
router.put('/change-password', auth, authController.changePassword);

module.exports = router; 