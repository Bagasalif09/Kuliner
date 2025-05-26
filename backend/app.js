const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const emakRoutes = require('./routes/emak');
const geprekRoutes = require('./routes/geprek');
const tempuraRoutes = require('./routes/tempura');
const sedepRoutes = require('./routes/sedep');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const imageRoutes = require('./routes/image');
const publicRoutes = require('./routes/public');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/emak', emakRoutes);
app.use('/api/geprek', geprekRoutes);
app.use('/api/tempura', tempuraRoutes);
app.use('/api/sedep', sedepRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/public', publicRoutes);

app.get('/api', (req, res) => {
  res.send('Kuliner API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
