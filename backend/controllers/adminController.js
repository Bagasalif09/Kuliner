const pool = require('../db');
const fs = require('fs');
const path = require('path');

const deleteImageFile = (imagePath) => {
  if (!imagePath) return;

  const fullPath = path.join(__dirname, '../public', imagePath);
  
  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) console.error('Error menghapus gambar:', err);
    });
  }
};

// Mendapatkan semua tenant
exports.getAllTenants = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tenants');
    
    // Tambahkan URL banner ke response
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

// Mendapatkan semua menu dari semua tenant
exports.getAllMenus = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, t.name as tenant_name 
      FROM menus m 
      JOIN tenants t ON m.tenant_id = t.id
      ORDER BY t.id, m.category, m.name
    `);

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

// Mendapatkan menu berdasarkan ID
exports.getMenuById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM menus WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }
    
    const menu = result.rows[0];

    if (menu.image_path) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      menu.image_url = `${baseUrl}${menu.image_path}`;
    }
    
    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Menambahkan menu baru
exports.addMenu = async (req, res) => {
  const { tenant_id, name, price, description, category } = req.body;
  
  try {
    if (!tenant_id || !name || !price) {
      return res.status(400).json({ message: 'Tenant ID, nama menu, dan harga wajib diisi' });
    }
    
    let imagePath = null;

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }
    
    const result = await pool.query(
      'INSERT INTO menus (tenant_id, name, price, description, category, image_path) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [tenant_id, name, price, description, category, imagePath]
    );
    
    const menu = result.rows[0];
    if (menu.image_path) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      menu.image_url = `${baseUrl}${menu.image_path}`;
    }
    
    res.status(201).json(menu);
  } catch (err) {
    if (req.file) {
      deleteImageFile(`/uploads/${req.file.filename}`);
    }
    
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Memperbarui menu
exports.updateMenu = async (req, res) => {
  const { id } = req.params;
  const { tenant_id, name, price, description, category } = req.body;
  
  try {
    if (!name || !price) {
      return res.status(400).json({ message: 'Nama menu dan harga wajib diisi' });
    }

    const existingMenu = await pool.query('SELECT * FROM menus WHERE id = $1', [id]);
    
    if (existingMenu.rows.length === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }
    
    let imagePath = existingMenu.rows[0].image_path;

    if (req.file) {
      if (imagePath) {
        deleteImageFile(imagePath);
      }
      imagePath = `/uploads/${req.file.filename}`;
    }
    
    const result = await pool.query(
      'UPDATE menus SET tenant_id = $1, name = $2, price = $3, description = $4, category = $5, image_path = $6 WHERE id = $7 RETURNING *',
      [tenant_id, name, price, description, category, imagePath, id]
    );

    const menu = result.rows[0];
    if (menu.image_path) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      menu.image_url = `${baseUrl}${menu.image_path}`;
    }
    
    res.json(menu);
  } catch (err) {
    if (req.file) {
      deleteImageFile(`/uploads/${req.file.filename}`);
    }
    
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMenu = async (req, res) => {
  const { id } = req.params;
  
  try {
    const existingMenu = await pool.query('SELECT image_path FROM menus WHERE id = $1', [id]);
    
    if (existingMenu.rows.length === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }

    const imagePath = existingMenu.rows[0].image_path;
    
    // Hapus menu dari database
    await pool.query('DELETE FROM menus WHERE id = $1', [id]);
    if (imagePath) {
      deleteImageFile(imagePath);
    }
    
    res.json({ message: 'Menu berhasil dihapus' });
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

// Memperbarui banner tenant
exports.updateTenantBanner = async (req, res) => {
  const { id } = req.params;
  
  try {
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
      'UPDATE tenants SET banner_path = $1 WHERE id = $2 RETURNING *',
      [bannerPath, id]
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

// Menghapus banner tenant
exports.deleteTenantBanner = async (req, res) => {
  const { id } = req.params;
  
  try {
    const existingTenant = await pool.query('SELECT banner_path FROM tenants WHERE id = $1', [id]);
    
    if (existingTenant.rows.length === 0) {
      return res.status(404).json({ message: 'Tenant tidak ditemukan' });
    }

    const bannerPath = existingTenant.rows[0].banner_path;
    
    if (!bannerPath) {
      return res.status(400).json({ message: 'Tenant tidak memiliki banner' });
    }

    await pool.query(
      'UPDATE tenants SET banner_path = NULL WHERE id = $1',
      [id]
    );
    
    deleteImageFile(bannerPath);
    
    res.json({ message: 'Banner tenant berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}; 