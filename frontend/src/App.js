import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TenantMenuPage from './pages/TenantMenuPage';
import PaymentPage from './pages/admin/PaymentPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMenusPage from './pages/admin/AdminMenusPage';
import AdminTenantsPage from './pages/admin/AdminTenantsPage';
import MenuFormPage from './pages/admin/MenuFormPage';
import TenantFormPage from './pages/admin/TenantFormPage';
import ChangePasswordPage from './pages/admin/ChangePasswordPage';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <div className="App">
      <AuthProvider>
<<<<<<< HEAD
      <Router>
        <Routes>
          {/* Halaman utama pengguna umum */}
          <Route path="/" element={<HomePage />} />

          {/* Halaman menu tenant untuk pengunjung */}
          <Route path="/tenant/:id" element={<TenantMenuPage />} />

            {/* Halaman admin */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Protected admin routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/menus" element={<AdminMenusPage />} />
              <Route path="/admin/menus/add" element={<MenuFormPage />} />
              <Route path="/admin/menus/edit/:id" element={<MenuFormPage />} />
              <Route path="/admin/tenants" element={<AdminTenantsPage />} />
              <Route path="/admin/tenants/edit/:id" element={<TenantFormPage />} />
              <Route path="/admin/change-password" element={<ChangePasswordPage />} />
            </Route>
        </Routes>
      </Router>
=======
        <Router>
         <Routes>
  {/* Halaman utama pengguna umum */}
  <Route path="/" element={<HomePage />} />
  <Route path="/tenant/:id" element={<TenantMenuPage />} />
  <Route path="/bayar/:name" element={<PaymentPage />} /> {/* ✅ Tambahan ini */}

  {/* Halaman admin */}
  <Route path="/admin/login" element={<AdminLoginPage />} />

  {/* Protected admin routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    <Route path="/admin/menus" element={<AdminMenusPage />} />
    <Route path="/admin/menus/add" element={<MenuFormPage />} />
    <Route path="/admin/menus/edit/:id" element={<MenuFormPage />} />
    <Route path="/admin/change-password" element={<ChangePasswordPage />} />
  </Route>
</Routes>

        </Router>
>>>>>>> 9c8687e2 (ya allah)
      </AuthProvider>
    </div>
  );
}

export default App;
