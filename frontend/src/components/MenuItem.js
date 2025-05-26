import React from 'react';
import './MenuItem.css';
import { useNavigate } from 'react-router-dom';

<<<<<<< HEAD
const MenuItem = ({ name, price, category, image_url, description }) => {
  const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || '';
  
=======
const MenuItem = ({ name, price, category }) => {
  const navigate = useNavigate();

>>>>>>> 9c8687e2 (ya allah)
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleClick = () => {
    navigate(`/bayar/${encodeURIComponent(name)}`, {
      state: { name, price, category },
    });
  };

  return (
<<<<<<< HEAD
    <div className="menu-item">
      {image_url && (
        <div className="menu-item-image">
          <img 
            src={image_url.startsWith('http') ? image_url : `${baseUrl}${image_url}`} 
            alt={name} 
          />
        </div>
      )}
      
      <div className="menu-item-content">
        <h3 className="menu-item-name">{name}</h3>
        {description && <p className="menu-item-description">{description}</p>}
        <div className="menu-item-footer">
          <span className="menu-item-price">{formatPrice(price)}</span>
          <span className="menu-item-category">{category}</span>
        </div>
=======
    <div className="menu-item" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="menu-item-info">
        <h4 className="menu-item-name">{name}</h4>
        <div className="menu-item-category">{category}</div>
        <div className="menu-item-price">{formatPrice(price)}</div>
>>>>>>> 9c8687e2 (ya allah)
      </div>
    </div>
  );
};

export default MenuItem;
