const express = require('express');
const router = express.Router();

// Import semua controller yang diperlukan
const orderController = require('../controllers/orderController');
const paymentController = require('../controllers/paymentController');

// Tambahkan route sesuai fitur
router.post('/order', orderController.createOrder);
router.get('/payments', paymentController.getPayments);
router.post('/payments', paymentController.addPayment);
router.put('/payments/:id', paymentController.updatePayment);
router.delete('/payments/:id', paymentController.deletePayment);

// Export router
module.exports = router;
