import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MenuItem from '../components/MenuItem';
import { getTenantById, getTenantMenu } from '../services/api';
import './TenantMenuPage.css';

const TenantMenuPage = () => {
  const { id } = useParams();
  const [tenant, setTenant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setAuthError(false);
      
      try {
        // Ambil data tenant
        const tenantData = await getTenantById(id);
        setTenant(tenantData);
        
        // Ambil menu tenant
        const menuData = await getTenantMenu(id);
        setMenuItems(menuData);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        
        if (error.response && error.response.status === 403) {
          setAuthError(true);
          setError('Akses ditolak. API key tidak valid atau tidak tersedia.');
        } else if (error.response && error.response.status === 404) {
          setError('Tenant tidak ditemukan');
        } else {
          setError('Gagal memuat data. Silakan coba lagi nanti.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const groupMenuByCategory = () => {
    const foodItems = menuItems.filter(item => item.category && item.category.toLowerCase() === 'makanan');
    const drinkItems = menuItems.filter(item => item.category && item.category.toLowerCase() === 'minuman');
    const paketItems = menuItems.filter(item => item.category && item.category.toLowerCase() === 'paket');
    
    return {
      makanan: foodItems,
      minuman: drinkItems,
      paket: paketItems
    };
  };

  if (loading) {
    return (
      <div className="loading-spinner">Memuat menu...</div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <Link to="/" className="back-button">Kembali ke Beranda</Link>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="error-container">
        <div className="error-message">Tenant tidak ditemukan</div>
        <Link to="/" className="back-button">Kembali ke Beranda</Link>
      </div>
    );
  }

  const renderMenuContent = () => {
    if (authError) {
      return (
        <div className="auth-error">
          <div className="error-message">
            <h3>Kesalahan Autentikasi</h3>
            <p>{error}</p>
            <p className="error-hint">Silakan periksa kembali API key Anda.</p>
          </div>
        </div>
      );
    }
    
    if (menuItems.length === 0) {
      return <div className="empty-menu">Menu tidak tersedia saat ini</div>;
    }
    
    const menuGroups = groupMenuByCategory();
    
    return (
      <>
        {menuGroups.makanan.length > 0 && (
          <div className="menu-category">
            <h3 className="category-title">Makanan</h3>
            <div className="menu-items-list">
              {menuGroups.makanan.map((item) => (
                <MenuItem
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  category={item.category}
                  imageUrl={item.image_url}
                />
              ))}
            </div>
          </div>
        )}
        
        {menuGroups.minuman.length > 0 && (
          <div className="menu-category">
            <h3 className="category-title">Minuman</h3>
            <div className="menu-items-list">
              {menuGroups.minuman.map((item) => (
                <MenuItem
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  category={item.category}
                  imageUrl={item.image_url}
                />
              ))}
            </div>
          </div>
        )}

        {menuGroups.paket.length > 0 && (
          <div className="menu-category">
            <h3 className="category-title">Paket</h3>
            <div className="menu-items-list">
              {menuGroups.paket.map((item) => (
                <MenuItem
                  key={item.id}
                  name={item.name}
                  price={item.price}
                  category={item.category}
                  imageUrl={item.image_url}
                />
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="tenant-menu-page">
      <div 
        className="tenant-banner"
        style={{ backgroundImage: tenant.banner_url ? `url(${tenant.banner_url})` : 'linear-gradient(to right, #ff9966, #ff5e62)' }}
      >
        <div className="banner-overlay">
          <Link to="/" className="back-link">
            &larr; Kembali
          </Link>
          <h1>{tenant.name}</h1>
          <p>{tenant.description || 'Menu dari ' + tenant.name}</p>
        </div>
      </div>

      <div className="menu-container">
        <h2>Menu</h2>
        
        {renderMenuContent()}
      </div>
    </div>
  );
};

export default TenantMenuPage; 