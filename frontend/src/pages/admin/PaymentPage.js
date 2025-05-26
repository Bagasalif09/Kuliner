import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './PaymentPage.css';

const paymentMethods = [
  { id: 'qris', name: 'QRIS', logo: '/public/qris.png' },
  { id: 'shopeepay', name: 'ShopeePay', logo: '/public/shopeepay.png' },
  { id: 'dana', name: 'DANA', logo: '/public/dana.png' },
  { id: 'ovo', name: 'OVO', logo: '/public/ovo.jpg' },
  { id: 'gopay', name: 'GoPay', logo: '/public/gopay.png' },
];

const PaymentPage = () => {
  const { name } = useParams();
  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleSelect = (method) => {
    setSelectedMethod(method);
  };

  return (
    <div className="payment-page">
      <h2>Pembayaran untuk pesanan: {decodeURIComponent(name)}</h2>
      <p>Silakan pilih metode pembayaran:</p>

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
  );
};

export default PaymentPage;
