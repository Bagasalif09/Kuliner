import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import TenantCrudPage from './pages/TenantCrudPage';
import HomePage from './pages/HomePage';
import TenantMenuPage from './pages/TenantMenuPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Halaman utama pengguna umum */}
          <Route path="/" element={<HomePage />} />

          {/* Dashboard admin */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Halaman CRUD tenant untuk admin */}
          <Route path="/admin/tenant/:tenantId" element={<TenantCrudPage />} />

          {/* Halaman menu tenant untuk pengunjung */}
          <Route path="/tenant/:id" element={<TenantMenuPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
