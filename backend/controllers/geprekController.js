const pool = require('../db');

const tenantId = 2;

exports.getMenu = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menus WHERE tenant_id = $1', [tenantId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMenu = async (req, res) => {
  const { name, price, category } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO menus (tenant_id, name, price, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [tenantId, name, price, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMenu = async (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;
  try {
    const result = await pool.query(
      'UPDATE menus SET name = $1, price = $2, category = $3 WHERE id = $4 AND tenant_id = $5 RETURNING *',
      [name, price, category, id, tenantId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMenu = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM menus WHERE id = $1 AND tenant_id = $2 RETURNING *',
      [id, tenantId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    res.json({ message: 'Menu deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
