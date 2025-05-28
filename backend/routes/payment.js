const express = require('express');
const router = express.Router();

// Dummy data (bisa ganti pakai database nanti)
let payments = [];

// Get all payments
router.get('/', (req, res) => {
  res.json(payments);
});

// Add a payment
router.post('/', (req, res) => {
  const payment = {
    id: payments.length + 1,
    method: req.body.method,
    status: req.body.status || 'pending'
  };
  payments.push(payment);
  res.status(201).json(payment);
});

// Update a payment
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const payment = payments.find(p => p.id === id);
  if (!payment) return res.status(404).json({ error: 'Not found' });

  payment.method = req.body.method || payment.method;
  payment.status = req.body.status || payment.status;

  res.json(payment);
});

// Delete a payment
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  payments = payments.filter(p => p.id !== id);
  res.json({ message: 'Payment deleted' });
});

module.exports = router;
