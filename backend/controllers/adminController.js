const pool = require('../db');
const fs = require('fs');
const path = require('path');

// Mendapatkan semua tenant
exports.getAllTenants = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tenants');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Mendapatkan semua menu dari semua tenant
exports.getAllMenus = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, t.name as tenant_name 
      FROM menus m 
      JOIN tenants t ON m.tenant_id = t.id
      ORDER BY t.id, m.category, m.name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Mendapatkan menu berdasarkan ID
exports.getMenuById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM menus WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Menambahkan menu baru
exports.addMenu = async (req, res) => {
  const { tenant_id, name, price, description, category, image_url } = req.body;
  
  try {
    if (!tenant_id || !name || !price) {
      return res.status(400).json({ message: 'Tenant ID, nama menu, dan harga wajib diisi' });
    }
    
    const result = await pool.query(
      'INSERT INTO menus (tenant_id, name, price, description, category, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [tenant_id, name, price, description, category, image_url]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Memperbarui menu
exports.updateMenu = async (req, res) => {
  const { id } = req.params;
  const { tenant_id, name, price, description, category, image_url } = req.body;
  
  try {
    if (!name || !price) {
      return res.status(400).json({ message: 'Nama menu dan harga wajib diisi' });
    }

    let oldImageUrl = null;
    if (image_url) {
      const oldMenu = await pool.query('SELECT image_url FROM menus WHERE id = $1', [id]);
      if (oldMenu.rows.length > 0 && oldMenu.rows[0].image_url) {
        oldImageUrl = oldMenu.rows[0].image_url;
      }
    }

    const result = await pool.query(
      `UPDATE menus 
       SET tenant_id = $1, name = $2, price = $3, description = $4, category = $5, 
           image_url = COALESCE($6, image_url)
       WHERE id = $7 RETURNING *`,
      [tenant_id, name, price, description, category, image_url, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }

    if (oldImageUrl && image_url && oldImageUrl !== image_url && oldImageUrl.startsWith('/uploads/')) {
      const oldImagePath = path.join(__dirname, '..', oldImageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Menghapus menu
exports.deleteMenu = async (req, res) => {
  const { id } = req.params;
  
  try {
    const menu = await pool.query('SELECT image_url FROM menus WHERE id = $1', [id]);
    
    const result = await pool.query('DELETE FROM menus WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }

    if (menu.rows.length > 0 && menu.rows[0].image_url && menu.rows[0].image_url.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', menu.rows[0].image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    res.json({ message: 'Menu berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Mendapatkan semua tenant (publik)
exports.getAllTenantsPublic = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tenants');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}; 