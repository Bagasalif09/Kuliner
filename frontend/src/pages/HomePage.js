import React from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const tenants = [
    {
      id: 'sedep',
      name: 'Dapur Sedep',
      imageUrl: '/images/tenant-sedep.png'
    },
    {
      id: 'minuman',
      name: 'Minuman',
      imageUrl: '/images/tenant-minuman.png'
    },
    {
      id: 'tempura',
      name: 'Tempura',
      imageUrl: '/images/tenant-tempura.png'
    },
    {
      id: 'warmindo',
      name: 'Warmindo',
      imageUrl: '/images/tenant-warmindo.png'
    }
  ];

  const handleTenantClick = (id) => {
    navigate(`/tenant/${id}`);
  };

  return (
    <div className="home-page">
      <div className="header">
        <h1>Menu Digital</h1>
        <p>Silahkan pilih tenant untuk melihat menu</p>
      </div>

      <div className="tenants-container">
        {tenants.map((tenant) => (
          <div
            className="tenant-card"
            key={tenant.id}
            onClick={() => handleTenantClick(tenant.id)}
          >
            <img
              src={tenant.imageUrl || '/placeholder-image.png'}
              alt={tenant.name}
            />
            <div>{tenant.name}</div>
          </div>
        ))}
      </div>

      <button className="lihat-pesanan-button">
        LIHAT PESANAN
      </button>
    </div>
  );
};

export default HomePage;
