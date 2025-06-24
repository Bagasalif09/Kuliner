-- Buat tabel tenants
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tenant_image TEXT,
    description TEXT
);

-- Buat tabel menus
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    description TEXT,
    category VARCHAR(50),
    image_url TEXT 
);

-- Buat tabel users untuk admin
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE pembukuan (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) CHECK (type IN ('pemasukan', 'pengeluaran')),
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT,
  entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data tenant (dengan gambar dan deskripsi)
INSERT INTO tenants (name, tenant_image, description) VALUES
('Minuman', '/uploads/tenants/tenant-1750214755178-176730141.png', 'Minuman yang segar dan Enak , bikin badan kembali semangat.'),
('Dapur Sedep', '/uploads/tenants/tenant-1750214727198-424059930.png', 'Ayam geprek super crispy dengan berbagai level kepedasan.'),
('Tempura', '/uploads/tenants/tenant-1750214762999-91805058.jpg', 'Tempura dan makanan Jepang yang renyah dan segar.'),
('Warmindo', '4,"Warmindo","","/uploads/tenants/tenant-1750214735743-618484669.jpg', 'Makanan indomie dengan rasa sedap yang menggugah selera.');

-- Menu untuk Tenant 1: Minuman
INSERT INTO menus (tenant_id, name, price, description, category, image_url) VALUES
(1, 'Es Teh Kin', 2000, '', 'minuman', NULL),
(1, 'Es Teh Jumbo', 3000, '', 'minuman', '/uploads/menus/menu-1750777730250-198644823.jpg'),
(1, 'Es Milk Tea', 5000, '', 'minuman', '/uploads/menus/menu-1750777720911-758578015.webp'),
(1, 'Es Jeruk', 3000, '', 'minuman', '/uploads/menus/menu-1750777713325-489006831.jpg'),
(1, 'Es Teh Tarik', 5000, '', 'minuman', '/uploads/menus/menu-1750777740638-455179991.jpeg'),
(1, 'Sogem', 8000, '', 'makanan', '/uploads/menus/menu-1750777453228-438690249.jpg'),
(1, 'Joshua', 5000, '', 'makanan', '/uploads/menus/menu-1750777503753-791105930.jpeg'),
(1, 'Es Teh Hijau', 3000, 'Minuman Teh Segar', 'minuman', '/uploads/menus/menu-1750777692219-766578972.jpeg'),
(1, 'Es Teh Manis', 5000, '', 'Minuman Dingin', '/uploads/menus/menu-1750776760571-239348707.webp'),
(1, 'Es Lemon Tea', 7000, 'Minuman Lemon Segera', 'minuman', '/uploads/menus/menu-1750777704563-141576072.jpg');

-- Menu untuk Tenant 2: Dapur Sedep
INSERT INTO menus (tenant_id, name, price, description, category, image_url) VALUES
(2, 'Ayam Geprek', 8000, '', 'makanan', '/uploads/menus/menu-1750777918867-985778299.jpg'),
(2, 'Ayam Richeese', 10000, '', 'makanan', '/uploads/menus/menu-1750777957482-326449395.webp'),
(2, 'Ayam Kremees', 8000, '', 'makanan', '/uploads/menus/menu-1750777942899-588802419.jpg'),
(2, 'Ayam Srundeng', 9000, '', 'makanan', '/uploads/menus/menu-1750777967755-831151017.jpg'),
(2, 'Ayam Katsu', 10000, '', 'makanan', '/uploads/menus/menu-1750777931983-768496311.jpeg'),
(2, 'Teh Hangat', 2500, '', 'minuman', '/uploads/menus/menu-1750777994264-772891193.jpeg'),
(2, 'Jeruk Hangat', 3500, '', 'minuman', '/uploads/menus/menu-1750777982402-182517131.jpg'),
(2, 'Paket Hemat Nasi + Es Teh', 10000, NULL, 'paket', NULL);

-- Menu untuk Tenant 3: Tempura
INSERT INTO menus (tenant_id, name, price, description, category, image_url) VALUES
(3, 'Tempura Ori (3 pcs)', 2000, NULL, 'makanan', NULL),
(3, 'Tempura Rasa Balado (3 pcs)', 2000, NULL, 'makanan', NULL),
(3, 'Tempura Rasa Barbeque (3 pcs)', 2000, NULL, 'makanan', NULL),
(3, 'Tempura Saos Sambel (3 pcs)', 2000, NULL, 'makanan', NULL),
(3, 'Tempura Saos Richeese', 5000, NULL, 'makanan', NULL),
(3, 'Tempura Geprek', 5000, NULL, 'makanan', NULL);

-- Menu untuk Tenant 4: Warmindo
INSERT INTO menus (tenant_id, name, price, description, category, image_url) VALUES
(4, 'Mie Telur + Nasi', 10000, '', 'paket', '/uploads/menus/menu-1750778232217-230587629.jpeg'),
(4, 'Mie Jumbo + Nasi', 10000, '', 'paket', '/uploads/menus/menu-1750778204086-119318481.jpg'),
(4, 'Mie Jumbo + Telur', 10000, '', 'paket', '/uploads/menus/menu-1750778220454-120586249.jpg'),
(4, 'Mie Jumbo + Es Teh', 10000, NULL, 'paket', NULL),
(4, 'Mie Telur + Es Teh', 10000, NULL, 'paket', NULL);

INSERT INTO orders (user_id, total_amount, status, order_date) VALUES
(1, 9000.00, 'completed', '2025-05-28 13:04:34.308631'),
(1, 18000.00, 'completed', '2025-05-28 13:15:22.879735'),
(1, 15000.00, 'pending', '2025-06-03 20:00:44.00026'),
(1, 25000.00, 'completed', '2025-06-02 20:00:44.00026'),
(1, 10000.00, 'processing', '2025-06-01 20:00:44.00026'),
(1, 10000.00, 'completed', '2025-06-03 20:01:20.164945'),
(1, 31000.00, 'completed', '2025-06-03 20:09:00.390274'),
(1, 8000.00, 'completed', '2025-06-03 20:09:52.402173'),
(1, 13000.00, 'completed', '2025-06-04 00:30:20.912124'),
(1, 17000.00, 'completed', '2025-06-18 10:55:50.491973');

INSERT INTO order_items (order_id, item_id, quantity) VALUES
(1, 1, 2),
(1, 3, 1),
(2, 5, 2),
(2, 10, 1),
(6, 7, 1),
(6, 1, 1),
(6, 2, 1),
(7, 6, 1),
(7, 7, 1),
(7, 8, 1),
(7, 9, 1),
(8, 16, 1),
(8, 17, 1),
(8, 18, 1),
(8, 19, 1),
(9, 6, 1),
(9, 7, 1),
(10, 1, 2),
(10, 2, 1);

INSERT INTO pembukuan (type, amount, description, entry_date) VALUES
('pemasukan', 10000.00, 'contoh', '2025-06-03 23:40:39.822436'),
('pengeluaran', 500000.00, 'contoh', '2025-06-03 23:42:04.329093'),
('pemasukan', 300000.00, 'contoh', '2025-06-03 23:43:51.040486'),
('pemasukan', 20000.00, 'Testing', '2025-06-03 23:46:37.848854'),
('pengeluaran', 10000.00, 'beli jajan', '2025-06-03 23:46:51.877956'),
('pemasukan', 30000.00, 'Utang Temen', '2025-06-03 23:48:07.298791'),
('pemasukan', 10000.00, 'Cilok', '2025-06-03 23:55:20.463620'),
('pengeluaran', 12000.00, 'Testing', '2025-06-03 23:55:48.048759'),
('pemasukan', 10000.00, 'Pemasukan dari order ID 6', '2025-06-03 23:58:08.167954'),
('pemasukan', 8000.00, 'Pemasukan dari order ID 8', '2025-06-03 23:58:17.748210'),
('pemasukan', 31000.00, 'Pemasukan dari order ID 7', '2025-06-03 23:58:18.235855'),
('pemasukan', 13000.00, 'Pemasukan dari order ID 9', '2025-06-04 00:30:43.115572'),
('pemasukan', 18000.00, 'Pemasukan dari order ID 2', '2025-06-10 11:48:26.217658'),
('pemasukan', 50000.00, 'Penjualan Minuman Aqua', '2025-06-18 07:36:40.436312'),
('pengeluaran', 25000.00, 'Pembelian Bahan', '2025-06-18 07:37:02.681759'),
('pemasukan', 9000.00, 'Pemasukan dari order ID 1', '2025-06-18 10:56:02.965075'),
('pemasukan', 17000.00, 'Pemasukan dari order ID 10', '2025-06-18 11:32:41.421871');

-- Insert akun admin default
-- Password: admin123 (nanti akan di-hash dalam implementasi)
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'admin');
