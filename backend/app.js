const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

console.log('API_KEY from env:', process.env.API_KEY);

// Existing route imports
const minumanRoutes = require('./routes/minuman');
const dapursedepRoutes = require('./routes/dapursedep');
const tempuraRoutes = require('./routes/tempura');
const warmindoRoutes = require('./routes/warmindo');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const imageRoutes = require('./routes/image');
const publicRoutes = require('./routes/public');

// NEW route imports (tambahan Anda)
const paymentRoutes = require('./routes/payment');
const orderRoutes = require('./routes/order');
const financeRoutes = require('./routes/pembukuan');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/minuman', minumanRoutes);
app.use('/api/dapursedep', dapursedepRoutes);
app.use('/api/tempura', tempuraRoutes);
app.use('/api/warmindo', warmindoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/public', publicRoutes);

// Tambahan baru:
app.use('/api/payments', paymentRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/finance', financeRoutes);


app.get('/api', (req, res) => {
  res.send('Kuliner API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
