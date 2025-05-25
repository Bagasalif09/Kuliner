const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const tenantRoutes = require('./routes/tenants');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tenants', tenantRoutes);

app.get('/api', (req, res) => {
  res.send('Kuliner API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
