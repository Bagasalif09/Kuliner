module.exports = function (req, res, next) {
  // Middleware ini harus digunakan setelah middleware auth
  // Cek apakah user adalah admin
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Akses ditolak, hanya admin yang diizinkan' });
  }
}; 