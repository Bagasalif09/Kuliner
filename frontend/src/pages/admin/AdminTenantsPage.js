import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTenants, deleteTenant } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminTenantsPage.css';

const AdminTenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllTenants();
      setTenants(data);
      setError(null);
    } catch (err) {
      console.error('Error mengambil data tenant:', err);
      setError('Gagal memuat data tenant. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirmDelete === id) {
      try {
        await deleteTenant(id);
        setTenants(tenants.filter(tenant => tenant.id !== id));
        setError(null);
        setConfirmDelete(null);
      } catch (err) {
        console.error(`Error menghapus tenant dengan ID ${id}:`, err);
        setError('Gagal menghapus tenant. Silakan coba lagi nanti.');
      }
    } else {
      setConfirmDelete(id);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-tenants-page">
          <h2>Kelola Tenant</h2>
          <div className="loading-spinner">Memuat data tenant...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-tenants-page">
        <div className="admin-tenants-header">
          <h2>Kelola Tenant</h2>
          <Link to="/admin/tenants/add" className="add-tenant-button">
            Tambah Tenant Baru
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {tenants.length === 0 ? (
          <div className="no-tenants-message">
            Tidak ada tenant yang ditemukan.
          </div>
        ) : (
          <div className="tenant-table-container">
            <table className="tenant-table">
              <thead>
                <tr>
                  <th>Banner</th>
                  <th>Nama</th>
                  <th>Deskripsi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(tenant => (
                  <tr key={tenant.id}>
                    <td className="tenant-image-cell">
                      {tenant.banner_url ? (
                        <img 
                          src={tenant.banner_url} 
                          alt={tenant.name} 
                          className="tenant-thumbnail" 
                        />
                      ) : (
                        <div className="no-image">Tidak ada banner</div>
                      )}
                    </td>
                    <td>{tenant.name}</td>
                    <td>{tenant.description || '-'}</td>
                    <td className="tenant-actions">
                      <Link to={`/admin/tenants/edit/${tenant.id}`} className="edit-button">Edit</Link>
                      <button 
                        onClick={() => handleDelete(tenant.id)} 
                        className={`delete-button ${confirmDelete === tenant.id ? 'confirm-delete' : ''}`}
                      >
                        {confirmDelete === tenant.id ? 'Konfirmasi' : 'Hapus'}
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

export default AdminTenantsPage; 