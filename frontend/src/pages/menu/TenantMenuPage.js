import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import MenuItem from '../../components/MenuItem';
import { getEmakMenu, getGeprekMenu, getTempuraMenu, getSedepMenu, getTenantInfo } from '../../services/api';
import { useCart } from './CartContext';
import './TenantMenuPage.css';

const tenantMap = {
  emak: 1,
  geprek: 2,
  tempura: 3,
  sedep: 4
};

const TenantMenuPage = () => {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [tenantDetails, setTenantDetails] = useState(null);
  const { totalItems } = useCart();

  // Ambil data tenant
  useEffect(() => {
    const fetchTenant = async () => {
      setLoading(true);
      setAuthError(false);
      setError(null);

      if (!tenantMap[id]) {
        setError('Tenant tidak ditemukan');
        setLoading(false);
        return;
      }

      try {
        const tenantData = await getTenantInfo(tenantMap[id]);
        setTenantDetails(tenantData);
      } catch (err) {
        setError('Gagal memuat informasi tenant');
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [id]);

  // Ambil data menu setelah tenantDetails tersedia
  useEffect(() => {
    const fetchMenu = async () => {
      if (!tenantDetails) return;
      setLoading(true);
      setAuthError(false);
      setError(null);

      try {
        let data = [];
        switch (id) {
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

        data = data.map(item => ({
          ...item,
          tenant_id: tenantMap[id],
          tenant_name: tenantDetails.name
        }));

        setMenuItems(data);
      } catch (error) {
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

    if (tenantDetails) {
      fetchMenu();
    }
  }, [id, tenantDetails]);

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

  if (!tenantDetails) {
    if (!loading && !error) {
      return (
        <div className="error-container">
          <div className="error-message">Tenant tidak ditemukan</div>
          <Link to="/" className="back-button">Kembali ke Beranda</Link>
        </div>
      );
    } else if (error) {
      return (
        <div className="error-container">
          <div className="error-message">{error}</div>
          <Link to="/" className="back-button">Kembali ke Beranda</Link>
        </div>
      );
    }
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
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  category={item.category}
                  image_url={item.image_url}
                  description={item.description}
                  tenant_id={item.tenant_id}
                  tenant_name={tenantDetails.name}
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
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  category={item.category}
                  image_url={item.image_url}
                  description={item.description}
                  tenant_id={item.tenant_id}
                  tenant_name={tenantDetails.name}
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
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  category={item.category}
                  image_url={item.image_url}
                  description={item.description}
                  tenant_id={item.tenant_id}
                  tenant_name={tenantDetails.name}
                />
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Memuat...</div>
      </div>
    );
  }

  const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || '';
  const imageUrl = tenantDetails?.tenant_image;
  const bannerStyle = imageUrl ? {
    backgroundImage: `url(${imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`})`
  } : {};

  return (
    <div className="tenant-menu-page">
      <div 
        className="tenant-banner"
        style={bannerStyle}
      >
        <div className="banner-overlay">
          <Link to="/" className="back-link">
            &larr; Kembali
          </Link>
          <h1>{tenantDetails?.name}</h1>
          <p>{tenantDetails?.description}</p>
        </div>
      </div>

      <div className="menu-container">
        <h2>Menu</h2>
        
        {renderMenuContent()}
      </div>
      
      <Link to="/cart" className="cart-link">
        <FaShoppingCart /> 
        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      </Link>
    </div>
  );
};

export default TenantMenuPage; 