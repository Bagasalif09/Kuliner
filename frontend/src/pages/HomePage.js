import React, { useState, useEffect } from 'react';
import TenantCard from '../components/TenantCard';
import { checkApiKeyValid } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const [apiKeyValid, setApiKeyValid] = useState(true);

  useEffect(() => {
    const checkApiKey = async () => {
      const isValid = await checkApiKeyValid();
      setApiKeyValid(isValid);
    };

    checkApiKey();
  }, []);

  const tenants = [
    {
      id: 'emak',
      name: 'Emak Food',
      description: 'Masakan rumahan khas Indonesia dengan cita rasa otentik.',
      imageUrl: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'geprek',
      name: 'Geprek Crispy',
      description: 'Ayam geprek super crispy dengan berbagai level kepedasan.',
      imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'tempura',
      name: 'Tempura House',
      description: 'Tempura dan makanan Jepang yang renyah dan segar.',
      imageUrl: 'https://images.pexels.com/photos/884596/pexels-photo-884596.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 'sedep',
      name: 'Sedep Rasa',
      description: 'Aneka hidangan dengan rasa sedap yang menggugah selera.',
      imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

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