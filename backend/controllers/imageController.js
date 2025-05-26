const pool = require('../db');
const fs = require('fs');
const path = require('path');

// Upload gambar menu
exports.uploadMenuImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file yang diupload' });
    }

    const menuId = req.params.id;
    const imageUrl = `/uploads/menus/${req.file.filename}`;

    const result = await pool.query(
      'UPDATE menus SET image_url = $1 WHERE id = $2 RETURNING *',
      [imageUrl, menuId]
    );

    if (result.rows.length === 0) {
      fs.unlinkSync(path.join(__dirname, '..', req.file.path));
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }

    res.json({
      message: 'Gambar berhasil diupload',
      menu: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Upload gambar tenant
exports.uploadTenantImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Tidak ada file yang diupload' });
    }

    const tenantId = req.params.id;
    const imageUrl = `/uploads/tenants/${req.file.filename}`;

    const result = await pool.query(
      'UPDATE tenants SET tenant_image = $1 WHERE id = $2 RETURNING *',
      [imageUrl, tenantId]
    );

    if (result.rows.length === 0) {
      fs.unlinkSync(path.join(__dirname, '..', req.file.path));
      return res.status(404).json({ message: 'Tenant tidak ditemukan' });
    }

    res.json({
      message: 'Gambar berhasil diupload',
      tenant: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update informasi tenant
exports.updateTenantInfo = async (req, res) => {
  try {
    const tenantId = req.params.id;
    const { description, tenant_image } = req.body;

    const result = await pool.query(
      'UPDATE tenants SET description = COALESCE($1, description), tenant_image = COALESCE($2, tenant_image) WHERE id = $3 RETURNING *',
      [description, tenant_image, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant tidak ditemukan' });
    }

    res.json({
      message: 'Informasi tenant berhasil diperbarui',
      tenant: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Mendapatkan informasi tenant
exports.getTenantInfo = async (req, res) => {
  try {
    const tenantId = req.params.id;
    
    const result = await pool.query(
      'SELECT * FROM tenants WHERE id = $1',
      [tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}; 