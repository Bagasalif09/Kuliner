-- Buat tabel tenants
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Buat tabel menus
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    description TEXT,
    category VARCHAR(50)
);

-- Buat tabel users untuk admin
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data tenant
INSERT INTO tenants (name) VALUES
('Emak'),
('Ayam Geprek'),
('Tempura'),
('Sedep');

-- Menu untuk Tenant 1: Emak
INSERT INTO menus (tenant_id, name, price, category) VALUES
(1, 'Es Teh Kin', 2000, 'minuman'),
(1, 'Es Teh Jumbo', 3000, 'minuman'),
(1, 'Es Milk Tea', 5000, 'minuman'),
(1, 'Es Jeruk', 3000, 'minuman'),
(1, 'Es Teh Tarik', 5000, 'minuman'),
(1, 'Sogem', 8000, 'makanan'),
(1, 'Joshua', 5000, 'makanan');

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

-- Insert akun admin default
-- Password: admin123 (nanti akan di-hash dalam implementasi)
INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'admin');
