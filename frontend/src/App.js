import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './pages/menu/CartContext';
import { AuthProvider } from './context/AuthContext';

import HomePage from './pages/menu/HomePage';
import TenantMenuPage from './pages/menu/TenantMenuPage';
import PaymentPage from './pages/menu/PaymentPage';
import CartPage from './pages/menu/CartPage';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMenusPage from './pages/admin/AdminMenusPage';
import AdminTenantsPage from './pages/admin/AdminTenantsPage';
import MenuFormPage from './pages/admin/MenuFormPage';
import TenantFormPage from './pages/admin/TenantFormPage';
import ChangePasswordPage from './pages/admin/ChangePasswordPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminSaldoPage from './pages/admin/AdminSaldoPage';
import SaldoFormPage from './pages/admin/SaldoFormPage';

import ProtectedRoute from './components/admin/ProtectedRoute';

import './App.css';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Halaman pengguna umum */}
              <Route path="/" element={<HomePage />} />
              <Route path="/tenant/:id" element={<TenantMenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/payment/:name" element={<PaymentPage />} />

              {/* Login admin */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Rute terlindungi untuk admin */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/menus" element={<AdminMenusPage />} />
                <Route path="/admin/menus/add" element={<MenuFormPage />} />
                <Route path="/admin/menus/edit/:id" element={<MenuFormPage />} />
                <Route path="/admin/tenants" element={<AdminTenantsPage />} />
                <Route path="/admin/tenants/edit/:id" element={<TenantFormPage />} />
                <Route path="/admin/change-password" element={<ChangePasswordPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="/admin/saldo" element={<AdminSaldoPage />} />
                <Route path="/admin/saldo/add" element={<SaldoFormPage />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
