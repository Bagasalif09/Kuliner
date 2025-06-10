const express = require('express');
const router = express.Router();
const db = require('../db'); // Pastikan path ini sesuai dengan lokasi file db.js

// GET /api/order - Ambil semua pesanan
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        o.id AS order_id,
        u.username,
        o.total_amount,
        o.status,
        o.order_date,
        json_agg(json_build_object(
          'item_id', m.id,
          'menu_name', m.name,
          'price', m.price,
          'quantity', oi.quantity
        )) AS items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN menus m ON oi.item_id = m.id
      GROUP BY o.id, u.username, o.total_amount, o.status, o.order_date
      ORDER BY o.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/order - Buat pesanan baru
router.post('/', async (req, res) => {
  const { user_id, items } = req.body;

  // Validasi dasar
  if (!user_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'user_id dan items diperlukan' });
  }

  try {
    // Hitung total harga
    let total = 0;
    for (const item of items) {
      const result = await db.query('SELECT price FROM menus WHERE id = $1', [item.item_id]);
      if (result.rows.length === 0) {
        return res.status(400).json({ error: `Item ID ${item.item_id} tidak ditemukan` });
      }
      total += result.rows[0].price * item.quantity;
    }

    // Insert ke orders
    const orderResult = await db.query(
      `INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING id`,
      [user_id, total]
    );
    const order_id = orderResult.rows[0].id;

    // Insert ke order_items
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, item_id, quantity) VALUES ($1, $2, $3)`,
        [order_id, item.item_id, item.quantity]
      );
    }

    res.status(201).json({
      message: 'Order created successfully!',
      order_id,
      total_amount: total
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/order/:id - Update status pesanan
router.patch('/:id', async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status tidak valid' });
  }

  try {
    // Update status pesanan
    await db.query('UPDATE orders SET status = $1 WHERE id = $2', [status, orderId]);

    // Jika status berubah menjadi completed, masukkan ke pembukuan
    if (status === 'completed') {
      const orderResult = await db.query('SELECT total_amount FROM orders WHERE id = $1', [orderId]);
      const totalAmount = orderResult.rows[0]?.total_amount || 0;

      // Cek apakah sudah pernah dimasukkan ke pembukuan sebelumnya
      const checkEntry = await db.query(
        `SELECT id FROM pembukuan WHERE description = $1`,
        [`Pemasukan dari order ID ${orderId}`]
      );

      if (checkEntry.rows.length === 0) {
        await db.query(
          `INSERT INTO pembukuan(type, amount, description) VALUES ('pemasukan', $1, $2)`,
          [totalAmount, `Pemasukan dari order ID ${orderId}`]
        );
      }
    }

    res.json({ message: 'Status pesanan diperbarui' });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
