const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login admin
exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Cari user di database
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }
    
    const user = result.rows[0];
    
    // Verifikasi password
    // Untuk implementasi awal, bisa langsung cek password tanpa bcrypt
    // Nanti bisa diupgrade dengan menggunakan bcrypt.compare
    const isMatch = password === user.password;
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }
    
    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'kuliner_secret_key',
      { expiresIn: '1d' }
    );
    
    res.json({ 
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Ubah password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;
  
  try {
    // Cari user di database
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    
    const user = result.rows[0];
    
    // Verifikasi password lama
    const isMatch = currentPassword === user.password;
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Password saat ini salah' });
    }
    
    // Update password baru
    // Nanti bisa diupgrade dengan menggunakan bcrypt.hash
    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [newPassword, userId]
    );
    
    res.json({ message: 'Password berhasil diubah' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}; 