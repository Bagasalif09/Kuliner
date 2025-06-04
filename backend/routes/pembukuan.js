const express = require('express');
const router = express.Router();
const pembukuanController = require('../controllers/pembukuanController');
const db = require('../db'); // Pastikan path ini sesuai dengan lokasi file db.js



// GET summary pemasukan/pengeluaran
router.get('/', pembukuanController.getFinanceSummary);

// POST entry manual (pemasukan/pengeluaran)
router.post('/manual', pembukuanController.createManualEntry);

// GET semua entry keuangan
router.get('/all', pembukuanController.getAllEntries);

module.exports = router;
