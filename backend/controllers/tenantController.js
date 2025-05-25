const pool = require('../db');

// Mendapatkan semua tenant
exports.getAllTenants = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tenants');

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const tenants = result.rows.map(tenant => {
      if (tenant.banner_path) {
        tenant.banner_url = `${baseUrl}${tenant.banner_path}`;
      }
      return tenant;
    });
    
    res.json(tenants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Mendapatkan tenant berdasarkan ID
exports.getTenantById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tenants WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant tidak ditemukan' });
    }
    
    const tenant = result.rows[0];

    if (tenant.banner_path) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      tenant.banner_url = `${baseUrl}${tenant.banner_path}`;
    }
    
    res.json(tenant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Menambahkan tenant baru
exports.createTenant = async (req, res) => {
  const { name, description } = req.body;
  
  try {
    if (!name) {
      return res.status(400).json({ message: 'Nama tenant wajib diisi' });
    }
    
    let bannerPath = null;

    if (req.file) {
      bannerPath = `/uploads/${req.file.filename}`;
    }
    
    const result = await pool.query(
      'INSERT INTO tenants (name, description, banner_path) VALUES ($1, $2, $3) RETURNING *',
      [name, description, bannerPath]
    );
    
    const tenant = result.rows[0];
    if (tenant.banner_path) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      tenant.banner_url = `${baseUrl}${tenant.banner_path}`;
    }
    
    res.status(201).json(tenant);
  } catch (err) {
    if (req.file) {
      deleteImageFile(`/uploads/${req.file.filename}`);
    }
    
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Memperbarui tenant
exports.updateTenant = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  
  try {
    if (!name) {
      return res.status(400).json({ message: 'Nama tenant wajib diisi' });
    }
    
    const existingTenant = await pool.query('SELECT banner_path FROM tenants WHERE id = $1', [id]);
    
    if (existingTenant.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant tidak ditemukan' });
    }
    
    let bannerPath = existingTenant.rows[0].banner_path;

    if (req.file) {
      if (bannerPath) {
        deleteImageFile(bannerPath);
      }
      bannerPath = `/uploads/${req.file.filename}`;
    }
    
    const result = await pool.query(
      'UPDATE tenants SET name = $1, description = $2, banner_path = $3 WHERE id = $4 RETURNING *',
      [name, description, bannerPath, id]
    );

    const tenant = result.rows[0];
    if (tenant.banner_path) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      tenant.banner_url = `${baseUrl}${tenant.banner_path}`;
    }
    
    res.json(tenant);
  } catch (err) {
    if (req.file) {
      deleteImageFile(`/uploads/${req.file.filename}`);
    }
    
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Menghapus tenant
exports.deleteTenant = async (req, res) => {
  const { id } = req.params;
  
  try {
    const existingTenant = await pool.query('SELECT banner_path FROM tenants WHERE id = $1', [id]);
    
    if (existingTenant.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant tidak ditemukan' });
    }

    const bannerPath = existingTenant.rows[0].banner_path;
    
    await pool.query('DELETE FROM tenants WHERE id = $1', [id]);
    
    if (bannerPath) {
      deleteImageFile(bannerPath);
    }
    
    res.json({ message: 'Tenant berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Mendapatkan menu 
exports.getTenantMenu = async (req, res) => {
  const { id } = req.params;
  
  try {
    const tenantExists = await pool.query('SELECT id FROM tenants WHERE id = $1', [id]);
    
    if (tenantExists.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant tidak ditemukan' });
    }
    
    const result = await pool.query('SELECT * FROM menus WHERE tenant_id = $1', [id]);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const menus = result.rows.map(menu => {
      if (menu.image_path) {
        menu.image_url = `${baseUrl}${menu.image_path}`;
      }
      return menu;
    });
    
    res.json(menus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const path = require('path');
const fs = require('fs');

const deleteImageFile = (imagePath) => {
  if (!imagePath) return;
  
  try {
    const fullPath = path.join(__dirname, '../public', imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.error('Error saat menghapus file gambar:', err);
  }
}; 