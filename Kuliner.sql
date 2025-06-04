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
('Minuman', '/uploads/tenants/tenant-1748252691405-996856856.png', 'Masakan rumahan khas Indonesia dengan cita rasa otentik.'),
('Dapur Sedep', '/uploads/tenants/tenant-1748252711445-245634590.png', 'Ayam geprek super crispy dengan berbagai level kepedasan.'),
('Tempura', '/uploads/tenants/tenant-1748252705887-884452407.png', 'Tempura dan makanan Jepang yang renyah dan segar.'),
('Warmindo', '/uploads/tenants/tenant-1748252699788-578840277.png', 'Aneka hidangan dengan rasa sedap yang menggugah selera.');

-- Menu untuk Tenant 1: Emak
INSERT INTO menus (tenant_id, name, price, category) VALUES
(1, 'Es Teh Kin', 2000, 'minuman'),
(1, 'Es Teh Jumbo', 3000, 'minuman'),
(1, 'Es Milk Tea', 5000, 'minuman'),
(1, 'Es Jeruk', 3000, 'minuman'),
(1, 'Es Teh Tarik', 5000, 'minuman'),
(1, 'Sogem', 8000, 'minuman'),
(1, 'Joshua', 5000, 'minuman');

-- Menu untuk Tenant 2: Ayam Geprek
INSERT INTO menus (tenant_id, name, price, category) VALUES
(2, 'Ayam Geprek', 8000, 'makanan'),
(2, 'Ayam Richeese', 10000, 'makanan'),
(2, 'Ayam Kremees', 8000, 'makanan'),
(2, 'Ayam Srundeng', 9000, 'makanan'),
(2, 'Ayam Katsu', 10000, 'makanan'),
(2, 'Teh Hangat', 2500, 'minuman'),
(2, 'Jeruk Hangat', 3500, 'minuman'),
(2, 'Paket Hemat Nasi + Es Teh', 10000, 'paket');

-- Menu untuk Tenant 3: Tempura
INSERT INTO menus (tenant_id, name, price, category) VALUES
(3, 'Tempura Ori (3 pcs)', 2000, 'makanan'),
(3, 'Tempura Rasa Balado (3 pcs)', 2000, 'makanan'),
(3, 'Tempura Rasa Barbeque (3 pcs)', 2000, 'makanan'),
(3, 'Tempura Saos Sambel (3 pcs)', 2000, 'makanan'),
(3, 'Tempura Saos Richeese', 5000, 'makanan'),
(3, 'Tempura Geprek', 5000, 'makanan');

-- Menu untuk Tenant 4: Dapur Sedep
INSERT INTO menus (tenant_id, name, price, category) VALUES
(4, 'Mie Telur + Nasi', 10000, 'paket'),
(4, 'Mie Jumbo + Nasi', 10000, 'paket'),
(4, 'Mie Jumbo + Telur', 10000, 'paket'),
(4, 'Mie Jumbo + Es Teh', 10000, 'paket'),
(4, 'Mie Telur + Es Teh', 10000, 'paket');

INSERT INTO orders (user_id, total_amount, status, order_date) VALUES
(1, 15000.00, 'pending', CURRENT_TIMESTAMP),
(1, 25000.00, 'completed', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(1, 10000.00, 'processing', CURRENT_TIMESTAMP - INTERVAL '2 days');

INSERT INTO order_items (order_id, item_id, quantity) VALUES
(1, 1, 2),   -- 2x Es Teh Kin
(2, 8, 1),   -- 1x Ayam Geprek
(2, 9, 1),   -- 1x Ayam Richeese
(3, 22, 1);  -- 1x Mie Telur + Es Teh

-- Insert akun admin default
-- Password: admin123 (nanti akan di-hash dalam implementasi)
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'admin');
