import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../pages/menu/CartContext';
import './MenuItem.css';

const MenuItem = ({ id, name, price, category, image_url, description, tenant_id, tenant_name }) => {
  const { addToCart } = useCart();
  const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || '';
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    addToCart({
      id,
      name,
      price,
      category,
      image_url,
      description,
      tenant_id,
      tenant_name
    });
  };

  return (
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
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          <FaShoppingCart /> Tambah
        </button>
      </div>
    </div>
  );
};

export default MenuItem; 
