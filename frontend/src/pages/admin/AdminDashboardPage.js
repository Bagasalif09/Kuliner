import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAllTenants, getAdminMenus } from '../../services/api';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [tenants, setTenants] = useState([]);
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [financeSummary, setFinanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financeError, setFinanceError] = useState(null);

  const kategori = [
    { value: 'makanan', label: 'Makanan' },
    { value: 'minuman', label: 'Minuman' },
    { value: 'paket', label: 'Paket' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tenantsData, menusData, ordersResponse, financeResponse] = await Promise.all([
          getAllTenants(),
          getAdminMenus(),
          fetch('http://localhost:3000/api/order').then(res => res.json()),
          fetch('http://localhost:3000/api/finance').then(res => res.json())
        ]);

        setTenants(tenantsData);
        setMenus(menusData);
        setOrders(ordersResponse);
        setFinanceSummary(financeResponse);
      } catch (err) {
        setError('Error mengambil data');
        setFinanceError('Error mengambil data keuangan');
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

  const formatRupiah = (number) => {
    return 'Rp' + Number(number).toLocaleString('id-ID', { minimumFractionDigits: 0 });
  };

  const totalIncome = financeSummary ? Number(financeSummary.total_pemasukan) : 0;
  const totalExpense = financeSummary ? Number(financeSummary.total_pengeluaran) : 0;
  const saldo = financeSummary ? Number(financeSummary.saldo) : 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-spinner">Loading...</div>
      </AdminLayout>
    );
  }

  if (error || financeError) {
    return (
      <AdminLayout>
        <div className="error-message">{error || financeError}</div>
      </AdminLayout>
    );
  }

  const categoryCounts = getMenuCountByCategory();

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h2>Dashboard</h2>
        <div className="dashboard-cards finance-summary">
          <div className="dashboard-card">
            <h3>Saldo</h3>
            <p className="stat-number">{formatRupiah(saldo)}</p>
          </div>

          <div className="dashboard-card">
            <h3>Total Pemasukan</h3>
            <p className="stat-number">{formatRupiah(totalIncome)}</p>
          </div>

          <div className="dashboard-card">
            <h3>Total Pengeluaran</h3>
            <p className="stat-number">{formatRupiah(totalExpense)}</p>
          </div>
        </div>
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

          <div className="dashboard-card">
            <h3>Pesanan</h3>
            <p className="stat-number">{orders.length}</p>
            <Link to="/admin/orders" className="card-link">Lihat Semua Pesanan</Link>
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
        </div>

        <div className="order-panel full-width">
          <h3>Pesanan</h3>
          <div className="order-table-container">
            {orders.length === 0 ? (
              <p className="no-entries">Belum ada pesanan.</p>
            ) : (
              <table className="order-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.order_id}>
                      <td>{order.order_id}</td>
                      <td>
                        <ul>
                          {order.items.map((item, idx) => (
                            <li key={idx}>{item.menu_name}</li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <ul>
                          {order.items.map((item, idx) => (
                            <li key={idx}>{item.quantity}</li>
                          ))}
                        </ul>
                      </td>
                      <td>{formatRupiah(order.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
