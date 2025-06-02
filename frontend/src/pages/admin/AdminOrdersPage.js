import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminOrdersPage.css';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/order');
      if (!response.ok) {
        throw new Error('Gagal fetch data');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat pesanan');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/order/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengubah status');
      }

      fetchOrders(); // refresh data
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengubah status');
    }
  };

  return (
    <AdminLayout>
      <div className="admin-orders">
        <h2 className="admin-orders-title">Daftar Pesanan</h2>

        {error && <p className="error">{error}</p>}
        {!error && orders.length === 0 && <p className="no-orders">Tidak ada pesanan.</p>}

        {orders.length > 0 && (
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Pemesan</th>
                <th>Total</th>
                <th>Status</th>
                <th>Items</th>
                <th>Ubah Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.username || '-'}</td>
                  <td>Rp{Number(order.total_amount).toLocaleString('id-ID')}</td>
                  <td>{order.status}</td>
                  <td>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.menu_name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {['pending', 'processing', 'completed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(order.order_id, status)}
                        disabled={order.status === status}
                        style={{
                          margin: '2px',
                          padding: '5px 10px',
                          backgroundColor: order.status === status ? '#ccc' : '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: order.status === status ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
