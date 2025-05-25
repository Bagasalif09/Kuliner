import React, { useState, useEffect } from 'react';
import TenantCard from '../components/TenantCard';
import { getAllTenants, checkApiKeyValid } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKeyValid, setApiKeyValid] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Verifikasi API key
        const isValid = await checkApiKeyValid();
        setApiKeyValid(isValid);
        
        // Ambil data tenant
        const tenantData = await getAllTenants();
        setTenants(tenantData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Gagal memuat data. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Memuat data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-page">
      <div className="header">
        <h1>Menu Digital</h1>
        <p>Silahkan pilih tenant untuk melihat menu</p>
      </div>
      
      {!apiKeyValid && (
        <div className="api-key-warning">
          <p>
            <strong>Perhatian:</strong> API key tidak valid atau tidak tersedia.
            Menu mungkin tidak dapat ditampilkan.
          </p>
        </div>
      )}
      
      <div className="tenants-container">
        {tenants.map((tenant) => (
          <TenantCard 
            key={tenant.id}
            id={tenant.id}
            name={tenant.name}
            description={tenant.description || ''}
            imageUrl={tenant.banner_url || ''}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage; 