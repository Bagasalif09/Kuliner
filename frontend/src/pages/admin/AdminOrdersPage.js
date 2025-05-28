import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminOrdersPage.css'; // Pastikan file ini berisi style di bawah ini

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchOrders();
  }, []);

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
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.customer_name || '-'}</td>
                  <td>Rp{Number(order.total_amount).toLocaleString()}</td>
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
