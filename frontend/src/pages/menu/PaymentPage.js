import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './PaymentPage.css';

const paymentMethods = [
  { id: 'qris', name: 'QRIS', logo: '/qris.png' },
  { id: 'shopeepay', name: 'ShopeePay', logo: '/shopeepay.png' },
  { id: 'dana', name: 'DANA', logo: '/dana.png' },
  { id: 'ovo', name: 'OVO', logo: '/ovo.jpg' },
  { id: 'gopay', name: 'GoPay', logo: '/gopay.png' },
];

const PaymentPage = () => {
  const { name } = useParams();
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleSelect = (method) => {
    setSelectedMethod(method);
  };

  return (
    <div className="payment-page">
      <div className="payment-header">
        <Link to="/cart" className="back-button">
          <FaArrowLeft />
        </Link>
        <h2>Pembayaran</h2>
      </div>

      <div className="payment-content">
        <p className="order-name">{decodeURIComponent(name)}</p>
        <p className="instruction">Silakan pilih metode pembayaran:</p>

        <div className="payment-options">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handleSelect(method)}
              className={`payment-button ${selectedMethod?.id === method.id ? 'selected' : ''}`}
            >
              <img src={method.logo} alt={method.name} />
              <span>{method.name}</span>
            </button>
          ))}
        </div>

        {selectedMethod && (
          <div className="payment-info">
            <h3>{selectedMethod.name}</h3>
            <img src={`/images/${selectedMethod.id}-qr.png`} alt={`QR ${selectedMethod.name}`} />
            <p>Silakan scan QR atau buka aplikasi {selectedMethod.name} untuk menyelesaikan pembayaran.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default PaymentPage;
