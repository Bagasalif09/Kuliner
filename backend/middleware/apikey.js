require('dotenv').config();

module.exports = function (req, res, next) {
  const key = req.headers['x-api-key'];
  if (key && key === process.env.API_KEY) {
    next();
  } else {
    res.status(403).json({ message: 'Invalid or missing API key' });
  }
};
