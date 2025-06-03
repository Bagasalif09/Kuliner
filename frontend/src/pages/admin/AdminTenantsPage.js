import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTenants } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminTenantsPage.css';

const AdminTenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenants = async () => {
      setLoading(true);
      try {
        const data = await getAllTenants();
        setTenants(data);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Gagal memuat data tenant. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-spinner">Memuat data tenant...</div>
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

  const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || '';

  return (
    <AdminLayout>
      <div className="admin-tenants-page">
        <div className="page-header">
          <h2>Kelola Tenant</h2>
        </div>

        <div className="tenants-list">
          <table className="tenants-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Tenant</th>
                <th>Deskripsi</th>
                <th>Gambar</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td>{tenant.id}</td>
                  <td><strong>{tenant.name}</strong></td>
                  <td className="description-cell">
                    {tenant.description || <span className="no-data">Tidak ada deskripsi</span>}
                  </td>
                  <td className="image-cell">
                    {tenant.tenant_image ? (
                      <img 
                        src={tenant.tenant_image.startsWith('http') 
                          ? tenant.tenant_image 
                          : `${baseUrl}${tenant.tenant_image}`} 
                        alt={tenant.name} 
                        className="tenant-thumbnail" 
                      />
                    ) : (
                      <span className="no-data">Tidak ada gambar</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/admin/tenants/edit/${tenant.id}`} className="edit-button">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTenantsPage; 