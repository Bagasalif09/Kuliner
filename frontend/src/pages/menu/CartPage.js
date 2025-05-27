import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import { useCart } from './CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, totalItems, totalPrice, updateQuantity } = useCart();
  const navigate = useNavigate();

  const groupedItems = {};
  cartItems.forEach(item => {
    if (!groupedItems[item.tenant_id]) {
      groupedItems[item.tenant_id] = {
        tenant_name: item.tenant_name,
        items: []
      };
    }
    groupedItems[item.tenant_id].items.push(item);
  });

  const handleCheckout = () => {
    const orderName = encodeURIComponent(`Pesanan (${totalItems} item)`);
    navigate(`/payment/${orderName}`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="cart-header">
          <Link to="/" className="back-button">
            <FaArrowLeft />
          </Link>
          <h2>Order</h2>
        </div>
        <div className="empty-cart-message">
          <FaShoppingCart size={50} />
          <p>Order Anda kosong</p>
          <Link to="/" className="browse-button">Lihat Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <Link to="/" className="back-button">
          <FaArrowLeft />
        </Link>
        <h2>Order</h2>
      </div>

      <div className="cart-content">
        {Object.keys(groupedItems).map(tenantId => (
          <div key={tenantId} className="tenant-items">
            <h3 className="tenant-name">{groupedItems[tenantId].tenant_name}</h3>
            
            <div className="cart-items">
              {groupedItems[tenantId].items.map(item => (
                <div key={`${item.id}-${item.tenant_id}`} className="cart-item">
                  <div className="item-image">
                    {item.image_url ? (
                      <img 
                        src={item.image_url.startsWith('http') 
                          ? item.image_url 
                          : `${process.env.REACT_APP_API_URL?.replace('/api', '')}${item.image_url}`} 
                        alt={item.name} 
                      />
                    ) : (
                      <div className="no-image">Tidak ada gambar</div>
                    )}
                  </div>
                  
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-price">Rp {item.price.toLocaleString('id-ID')}</p>
                    <p className="item-category">{item.category}</p>
                  </div>
                  
                  <div className="item-actions">
                    <div className="item-price-total">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </div>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.tenant_id, item.quantity - 1)}
                        className="quantity-button minus-button"
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.tenant_id, item.quantity + 1)}
                        className="quantity-button plus-button"
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Total Item:</span>
          <span>{totalItems} item</span>
        </div>
        <div className="summary-row total">
          <span>Total Harga:</span>
          <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
        </div>
        <button onClick={handleCheckout} className="checkout-button">
          Lanjutkan ke Pembayaran
        </button>
      </div>
    </div>
  );
};

export default CartPage; 