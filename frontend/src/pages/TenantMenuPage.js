import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MenuItem from '../components/MenuItem';
import { getEmakMenu, getGeprekMenu, getTempuraMenu, getSedepMenu } from '../services/api';
import './TenantMenuPage.css';

const TenantMenuPage = () => {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(false);

  const tenantInfo = {
    emak: {
      name: 'Emak Food',
      description: 'Masakan rumahan khas Indonesia dengan cita rasa otentik.',
      banner: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    geprek: {
      name: 'Geprek Crispy',
      description: 'Ayam geprek super crispy dengan berbagai level kepedasan.',
      banner: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    tempura: {
      name: 'Tempura House',
      description: 'Tempura dan makanan Jepang yang renyah dan segar.',
      banner: 'https://images.pexels.com/photos/884596/pexels-photo-884596.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    sedep: {
      name: 'Sedep Rasa',
      description: 'Aneka hidangan dengan rasa sedap yang menggugah selera.',
      banner: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      setAuthError(false);
      
      try {
        let data = [];
        
        switch(id) {
          case 'emak':
            data = await getEmakMenu();
            break;
          case 'geprek':
            data = await getGeprekMenu();
            break;
          case 'tempura':
            data = await getTempuraMenu();
            break;
          case 'sedep':
            data = await getSedepMenu();
            break;
          default:
            setError('Tenant tidak ditemukan');
        }
        
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        
        if (error.response && error.response.status === 403) {
          setAuthError(true);
          setError('Akses ditolak. API key tidak valid atau tidak tersedia.');
        } else {
          setError('Gagal memuat menu. Silakan coba lagi nanti.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [id]);

  const groupMenuByCategory = () => {
    const foodItems = menuItems.filter(item => item.category.toLowerCase() === 'makanan');
    const drinkItems = menuItems.filter(item => item.category.toLowerCase() === 'minuman');
    const paketitems = menuItems.filter(item => item.category.toLowerCase() === 'paket');
    
    return {
      makanan: foodItems,
      minuman: drinkItems,
      paket: paketitems
    };
  };

  if (!tenantInfo[id]) {
    return (
      <div className="error-container">
        <div className="error-message">Tenant tidak ditemukan</div>
        <Link to="/" className="back-button">Kembali ke Beranda</Link>
      </div>
    );
  }

  const renderMenuContent = () => {
    if (loading) {
      return <div className="loading-spinner">Memuat menu...</div>;
    }
    
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
    
    if (error) {
      return <div className="error-message">{error}</div>;
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
        style={{ backgroundImage: `url(${tenantInfo[id]?.banner})` }}
      >
        <div className="banner-overlay">
          <Link to="/" className="back-link">
            &larr; Kembali
          </Link>
          <h1>{tenantInfo[id]?.name}</h1>
          <p>{tenantInfo[id]?.description}</p>
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