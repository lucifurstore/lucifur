import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/adminApi';
import styles from './admin.module.css';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_OPTIONS = ['unpaid', 'paid', 'refunded'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    adminApi
      .getOrders(statusFilter ? `status=${statusFilter}` : '')
      .then((d) => setOrders(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const handleStatusChange = async (orderId, field, value) => {
    setUpdating(orderId);
    try {
      const updated = await adminApi.updateOrder(orderId, { [field]: value });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated.data : o)));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <AdminLayout pageTitle="Orders">
      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h2>All Orders ({orders.length})</h2>
          <div className={styles.actionsGroup}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                background: 'var(--bg-primary)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', padding: '6px 12px', fontSize: '0.75rem',
                fontFamily: 'var(--font-main)', outline: 'none', letterSpacing: '1px',
              }}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingState}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyState}>No orders found</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ opacity: updating === order._id ? 0.5 : 1 }}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>
                      {order.shippingAddress?.fullName || order.user?.name || 'Guest'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      {order.shippingAddress?.email}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      {order.shippingAddress?.phone}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                    {formatDate(order.createdAt)}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                    {order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}
                  </td>
                  <td style={{ fontWeight: 500 }}>{formatCurrency(order.totalAmount)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, 'status', e.target.value)}
                      disabled={updating === order._id}
                      style={{
                        background: 'var(--bg-primary)', border: '1px solid var(--border)',
                        color: 'var(--text-primary)', padding: '4px 8px', fontSize: '0.7rem',
                        fontFamily: 'var(--font-main)', outline: 'none', cursor: 'pointer',
                        letterSpacing: '1px',
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.toUpperCase()}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handleStatusChange(order._id, 'paymentStatus', e.target.value)}
                      disabled={updating === order._id}
                      style={{
                        background: 'var(--bg-primary)', border: '1px solid var(--border)',
                        color: 'var(--text-primary)', padding: '4px 8px', fontSize: '0.7rem',
                        fontFamily: 'var(--font-main)', outline: 'none', cursor: 'pointer',
                        letterSpacing: '1px',
                      }}
                    >
                      {PAYMENT_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.toUpperCase()}</option>
                      ))}
                    </select>
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

export default AdminOrders;
