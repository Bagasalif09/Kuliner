const db = require('../db');

// POST /order
exports.createOrder = async (req, res) => {
  const { user_id, items, total_amount } = req.body;

  if (!user_id || !items || !total_amount) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    // Simpan ke tabel orders
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [user_id, total_amount, 'pending']
    );
    const orderId = orderResult.insertId;

    // Simpan ke tabel order_items
    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, item_id, quantity) VALUES (?, ?, ?)',
        [orderId, item.item_id, item.quantity]
      );
    }

    // Simulasi push ke admin (log atau bisa integrasi dengan Firebase/WebSocket)
    console.log(`📢 New Order! ID: ${orderId}, User: ${user_id}, Total: ${total_amount}`);

    res.status(201).json({ message: 'Order created', orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
