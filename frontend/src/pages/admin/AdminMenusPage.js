import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAdminMenus, getAllTenants, deleteMenu } from '../../services/api';
import './AdminMenusPage.css';

const AdminMenusPage = () => {
  const [menus, setMenus] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTenant, setFilterTenant] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const kategori = [
    { value: 'makanan', label: 'Makanan' },
    { value: 'minuman', label: 'Minuman' },
    { value: 'paket', label: 'Paket' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [menusData, tenantsData] = await Promise.all([
          getAdminMenus(),
          getAllTenants()
        ]);
        
        setMenus(menusData);
        setTenants(tenantsData);
      } catch (err) {
        setError('Error mengambil data menu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      try {
        await deleteMenu(id);
        setMenus(menus.filter(menu => menu.id !== id));
        alert('Menu berhasil dihapus');
      } catch (err) {
        alert('Gagal menghapus menu');
        console.error(err);
      }
    }
  };

  const getTenantName = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : 'Tidak diketahui';
  };

  const filteredMenus = menus.filter(menu => {
    const matchesTenant = filterTenant ? menu.tenant_id === parseInt(filterTenant) : true;
    const matchesCategory = filterCategory ? menu.category === filterCategory : true;
    const matchesSearch = searchTerm 
      ? menu.name.toLowerCase().includes(searchTerm.toLowerCase()) 
      : true;
    
    return matchesTenant && matchesCategory && matchesSearch;
  });

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

  return (
    <AdminLayout>
      <div className="admin-menus">
        <div className="admin-menus-header">
          <h2>Kelola Menu</h2>
          <Link to="/admin/menus/add" className="add-menu-button">Tambah Menu Baru</Link>
        </div>

        <div className="admin-menus-filters">
          <div className="filter-group">
            <label htmlFor="searchTerm">Cari:</label>
            <input
              type="text"
              id="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama menu..."
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="filterTenant">Tenant:</label>
            <select
              id="filterTenant"
              value={filterTenant}
              onChange={(e) => setFilterTenant(e.target.value)}
            >
              <option value="">Semua Tenant</option>
              {tenants.map(tenant => (
                <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="filterCategory">Kategori:</label>
            <select
              id="filterCategory"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {kategori.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredMenus.length === 0 ? (
          <div className="no-menus-message">
            Tidak ada menu yang ditemukan.
          </div>
        ) : (
          <div className="menu-table-container">
            <table className="menu-table">
              <thead>
                <tr>
                  <th>Nama Menu</th>
                  <th>Tenant</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredMenus.map(menu => (
                  <tr key={menu.id}>
                    <td>{menu.name}</td>
                    <td>{getTenantName(menu.tenant_id)}</td>
                    <td>{menu.category ? 
                      kategori.find(opt => opt.value === menu.category.toLowerCase())?.label || 
                      menu.category : '-'}
                    </td>
                    <td>Rp {menu.price.toLocaleString()}</td>
                    <td className="menu-actions">
                      <Link to={`/admin/menus/edit/${menu.id}`} className="edit-button">Edit</Link>
                      <button 
                        onClick={() => handleDelete(menu.id)} 
                        className="delete-button"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMenusPage; 