import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>Kuliner Admin</h1>
        <div className="admin-user-info">
          <span>Selamat datang, {user?.username}</span>
          <button onClick={handleLogout} className="logout-button">Keluar</button>
        </div>
      </header>

      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav>
            <ul>
              <li>
                <Link to="/admin/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/admin/menus">Kelola Menu</Link>
              </li>
              <li>
                <Link to="/admin/change-password">Ubah Password</Link>
              </li>
              <li>
                <a href="/" target="_blank" rel="noopener noreferrer">Lihat Menu</a>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 