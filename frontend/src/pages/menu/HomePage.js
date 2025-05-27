import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import TenantCard from '../../components/TenantCard';
import { checkApiKeyValid, getAllTenantsPublic } from '../../services/api';
import { useCart } from './CartContext';
import './HomePage.css';

const HomePage = () => {
  const [apiKeyValid, setApiKeyValid] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { totalItems } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const isValid = await checkApiKeyValid();
      setApiKeyValid(isValid);

      const tenantsData = await getAllTenantsPublic();
      
      if (tenantsData && tenantsData.length > 0) {
        const formattedTenants = tenantsData.map(tenant => ({
          id: getTenantSlug(tenant.id, tenant.name),
          name: tenant.name,
          description: tenant.description || '',
          imageUrl: formatImageUrl(tenant.tenant_image)
        }));
        setTenants(formattedTenants);
      } else {
        setTenants([]);
      }
      
      setLoading(false);
    };

    fetchData();
  }, []);

  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    
    const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') ;
    return imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
  };

  const getTenantSlug = (id, name) => {
    const slugMap = {
      1: 'Minuman',
      2: 'DapurSedep',
      3: 'Tempura',
      4: 'Warmindo'
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
        <div className="header-content">
          <h1>Menu Digital</h1>
          <p>Silahkan pilih tenant untuk melihat menu</p>
        </div>
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
        {tenants.length > 0 ? (
          tenants.map((tenant) => (
            <TenantCard 
              key={tenant.id}
              id={tenant.id}
              name={tenant.name}
              description={tenant.description}
              imageUrl={tenant.imageUrl}
            />
          ))
        ) : (
          <div className="empty-tenants">
            <p>Tidak ada tenant yang tersedia saat ini.</p>
          </div>
        )}
      </div>
      
      <Link to="/cart" className="cart-button">
        <FaShoppingCart />
        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      </Link>
    </div>
  );
};

export default HomePage; 