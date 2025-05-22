import React from 'react';
import './MenuItem.css';

const MenuItem = ({ name, price, category }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="menu-item">
      <div className="menu-item-info">
        <h4 className="menu-item-name">{name}</h4>
        <div className="menu-item-category">{category}</div>
        <div className="menu-item-price">{formatPrice(price)}</div>
      </div>
    </div>
  );
};

export default MenuItem; 