import React from 'react';
import { Link } from 'react-router-dom';
import './TenantCard.css';

const TenantCard = ({ id, name, description, imageUrl }) => {
  return (
    <div className="tenant-card">
      <div className="tenant-image">
        <img src={imageUrl} alt={name} />
      </div>
      <div className="tenant-info">
        <h3>{name}</h3>
        <p>{description}</p>
        <Link to={`/tenant/${id}`} className="menu-button">
          Lihat Menu
        </Link>
      </div>
    </div>
  );
};

export default TenantCard; 