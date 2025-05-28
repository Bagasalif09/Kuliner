// src/pages/admin/AdminDashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAllTenants, getAdminMenus } from '../../services/api';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [tenants, setTenants] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const kategori = [
    { value: 'makanan', label: 'Makanan' },
    { value: 'minuman', label: 'Minuman' },
    { value: 'paket', label: 'Paket' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tenantsData, menusData] = await Promise.all([
          getAllTenants(),
          getAdminMenus()
        ]);
        setTenants(tenantsData);
        setMenus(menusData);
      } catch (err) {
        setError('Error mengambil data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getMenuCountByTenant = (tenantId) => {
    return menus.filter(menu => menu.tenant_id === tenantId).length;
  };

  const getTotalMenuCount = () => menus.length;

  const getMenuCountByCategory = () => {
    const categoryCounts = {};
    menus.forEach(menu => {
      if (!menu.category) {
        if (!categoryCounts['Tidak ada kategori']) {
          categoryCounts['Tidak ada kategori'] = 0;
        }
        categoryCounts['Tidak ada kategori'] += 1;
        return;
      }
      const categoryOption = kategori.find(opt => 
        opt.value === menu.category.toLowerCase()
      );
      const categoryLabel = categoryOption ? categoryOption.label : menu.category;
      if (!categoryCounts[categoryLabel]) {
        categoryCounts[categoryLabel] = 0;
      }
      categoryCounts[categoryLabel] += 1;
    });
    return categoryCounts;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-spinner">Loading...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="error-message">{error}</div>
      </AdminLayout>
    );
  }

  const categoryCounts = getMenuCountByCategory();

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h2>Dashboard</h2>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Total Menu</h3>
            <p className="stat-number">{getTotalMenuCount()}</p>
            <Link to="/admin/menus" className="card-link">Lihat Semua Menu</Link>
          </div>

          <div className="dashboard-card">
            <h3>Total Tenant</h3>
            <p className="stat-number">{tenants.length}</p>
          </div>
        </div>

        <div className="dashboard-panels">
          <div className="dashboard-panel">
            <h3>Menu per Tenant</h3>
            <div className="tenant-stats">
              {tenants.map(tenant => (
                <div key={tenant.id} className="tenant-stat-item">
                  <span className="tenant-name">{tenant.name}</span>
                  <span className="tenant-menu-count">{getMenuCountByTenant(tenant.id)} menu</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-panel">
            <h3>Menu per Kategori</h3>
            <div className="category-stats">
              {Object.entries(categoryCounts).map(([category, count]) => (
                <div key={category} className="category-stat-item">
                  <span className="category-name">{category}</span>
                  <span className="category-menu-count">{count} menu</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-panel">
            <h3>Pesanan</h3>
            <div className="orders-panel">
              <p className="stat-number">12</p>
              <Link to="/admin/orders" className="card-link">Lihat Semua Pesanan</Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
