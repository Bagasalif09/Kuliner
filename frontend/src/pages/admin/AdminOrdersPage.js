import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminOrdersPage.css';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/order');
      if (!response.ok) {
        throw new Error('Gagal fetch data');
      }
      const data = await response.json();
      setOrders(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Gagal memuat pesanan');
    } finally {
      setLoading(false);
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

      fetchOrders();
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat mengubah status');
    }
  };

  const getStatusClassName = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'order-status order-status-pending';
      case 'processing':
        return 'order-status order-status-processing';
      case 'completed':
        return 'order-status order-status-completed';
      case 'cancelled':
        return 'order-status order-status-cancelled';
      default:
        return 'order-status';
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <AdminLayout>
      <div className="admin-orders">
        <div className="page-header">
          <h2>Daftar Pesanan</h2>
          <div className="filter-container">
            <label htmlFor="status-filter">Filter Status:</label>
            <select 
              id="status-filter" 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="status-filter"
            >
              <option value="all">Semua</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading && <div className="loading-spinner">Memuat data...</div>}
        {error && <div className="error-message">{error}</div>}
        
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="no-orders">Tidak ada pesanan dengan status ini.</div>
        )}

        {!loading && !error && filteredOrders.length > 0 && (
          <div className="orders-list">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Pemesan</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td>#{order.order_id}</td>
                    <td>{order.username || '-'}</td>
                    <td><strong>Rp{Number(order.total_amount).toLocaleString('id-ID')}</strong></td>
                    <td>
                      <span className={getStatusClassName(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <ul>
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            <strong>{item.menu_name}</strong> <b>x {item.quantity}</b>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="action-cell">
                      <div className="action-buttons">
                        {['pending', 'processing', 'completed', 'cancelled'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(order.order_id, status)}
                            disabled={order.status === status}
                            className={`status-button ${order.status === status ? 'status-button-active' : ''} status-button-${status}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
