import React, { useState, useEffect } from 'react';
import TenantCard from '../components/TenantCard';
import { checkApiKeyValid, getAllTenantsPublic } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const [apiKeyValid, setApiKeyValid] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Check API key validity
      const isValid = await checkApiKeyValid();
      setApiKeyValid(isValid);
      
      // Get tenants from API
      const tenantsData = await getAllTenantsPublic();
      
      if (tenantsData && tenantsData.length > 0) {
        // Map tenant data to required format
        const formattedTenants = tenantsData.map(tenant => ({
          id: getTenantSlug(tenant.id, tenant.name),
          name: tenant.name,
          description: tenant.description || '',
          imageUrl: formatImageUrl(tenant.tenant_image)
        }));
        setTenants(formattedTenants);
      } else {
        // Fallback to hardcoded tenants if API fails
        setTenants([
          {
            id: 'emak',
            name: 'Emak Food',
            description: 'Masakan rumahan khas Indonesia dengan cita rasa otentik.',
            imageUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800&h=400'
          },
          {
            id: 'geprek',
            name: 'Geprek Crispy',
            description: 'Ayam geprek super crispy dengan berbagai level kepedasan.',
            imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=400'
          },
          {
            id: 'tempura',
            name: 'Tempura House',
            description: 'Tempura dan makanan Jepang yang renyah dan segar.',
            imageUrl: 'https://images.pexels.com/photos/884596/pexels-photo-884596.jpeg?auto=compress&cs=tinysrgb&w=800&h=400'
          },
          {
            id: 'sedep',
            name: 'Sedep Rasa',
            description: 'Aneka hidangan dengan rasa sedap yang menggugah selera.',
            imageUrl: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800&h=400'
          }
        ]);
      }
      
      setLoading(false);
    };

    fetchData();
  }, []);

  // Helper function to format image URL
  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    
    const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || '';
    return imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
  };

  // Helper function to get tenant slug from ID/name
  const getTenantSlug = (id, name) => {
    const slugMap = {
      1: 'emak',
      2: 'geprek',
      3: 'tempura',
      4: 'sedep'
    };
    
    return slugMap[id] || name.toLowerCase().replace(/\s+/g, '-');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Memuat...</div>
      </div>
    );
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
            description={tenant.description}
            imageUrl={tenant.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage; 