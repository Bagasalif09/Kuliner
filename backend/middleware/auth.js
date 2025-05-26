const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Ambil token dari header
  const token = req.header('x-auth-token');
  
  // Cek jika tidak ada token
  if (!token) {
    return res.status(401).json({ message: 'Tidak ada token, akses ditolak' });
  }
  
  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
}; 