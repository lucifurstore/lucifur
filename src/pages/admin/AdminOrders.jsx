import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/adminApi';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import styles from './admin.module.css';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_OPTIONS = ['unpaid', 'paid', 'refunded'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useDocumentTitle('Admin Orders');
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState(null);
  const [exchangeNotes, setExchangeNotes] = useState({});

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

  const handleExchangeStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      const updated = await adminApi.updateOrderExchange(orderId, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated.data : o)));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleSaveExchangeNotes = async (orderId) => {
    const notes = exchangeNotes[orderId];
    if (notes === undefined) return;
    setUpdating(orderId);
    try {
      const updated = await adminApi.updateOrderExchange(orderId, { adminNotes: notes });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated.data : o)));
      alert('Notes saved successfully');
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
          <div className={styles.headerActions}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.statusSelect}
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
          <table className={`${styles.table} ${styles.tableOrders}`}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th className={styles.hideBelow600}>Date</th>
                <th className={styles.hideBelow768}>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const hasExchange = order.exchangeRequest && order.exchangeRequest.isRequested;
                return (
                  <React.Fragment key={order._id}>
                    <tr style={{ opacity: updating === order._id ? 0.5 : 1 }}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        <div>#{order._id.slice(-8).toUpperCase()}</div>
                        {hasExchange && (
                          <div style={{
                            marginTop: 6,
                            fontSize: '0.55rem',
                            color: order.exchangeRequest.status === 'pending' ? '#f0c040' : 
                                   order.exchangeRequest.status === 'approved' ? '#60b0ff' : 
                                   order.exchangeRequest.status === 'rejected' ? '#f87171' : '#4ade80',
                            fontWeight: 'bold',
                            letterSpacing: '1px'
                          }}>
                            EXCHANGE: {order.exchangeRequest.status.toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>
                          {order.shippingAddress?.fullName || order.user?.name || 'Guest'}
                        </div>
                        <div className={styles.hideBelow480} style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                          {order.shippingAddress?.email}
                        </div>
                        <div className={styles.hideBelow480} style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                          {order.shippingAddress?.phone}
                        </div>
                      </td>
                      <td className={styles.hideBelow600} style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                        {formatDate(order.createdAt)}
                      </td>
                      <td className={styles.hideBelow768} style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                        {order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}
                      </td>
                      <td style={{ fontWeight: 500 }}>{formatCurrency(order.totalAmount)}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, 'status', e.target.value)}
                          disabled={updating === order._id}
                          className={styles.cellSelect}
                          aria-label={`Order status for ${order._id.slice(-8)}`}
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
                          className={styles.cellSelect}
                          aria-label={`Payment status for ${order._id.slice(-8)}`}
                        >
                          {PAYMENT_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.toUpperCase()}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    {hasExchange && (
                      <tr>
                        <td colSpan="7" style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                              <div>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase', marginRight: 8 }}>
                                  Exchange Status:
                                </span>
                                <span style={{ 
                                  fontSize: '0.62rem', 
                                  letterSpacing: '1.5px', 
                                  fontWeight: 700, 
                                  padding: '2px 8px', 
                                  border: '1px solid',
                                  color: order.exchangeRequest.status === 'pending' ? '#f0c040' : 
                                         order.exchangeRequest.status === 'approved' ? '#60b0ff' : 
                                         order.exchangeRequest.status === 'rejected' ? '#f87171' : '#4ade80',
                                  borderColor: order.exchangeRequest.status === 'pending' ? 'rgba(240,192,64,0.3)' : 
                                               order.exchangeRequest.status === 'approved' ? 'rgba(96,176,255,0.3)' : 
                                               order.exchangeRequest.status === 'rejected' ? 'rgba(248,113,113,0.3)' : 'rgba(74,222,128,0.3)',
                                  background: order.exchangeRequest.status === 'pending' ? 'rgba(240,192,64,0.08)' : 
                                              order.exchangeRequest.status === 'approved' ? 'rgba(96,176,255,0.08)' : 
                                              order.exchangeRequest.status === 'rejected' ? 'rgba(248,113,113,0.08)' : 'rgba(74,222,128,0.08)',
                                  textTransform: 'uppercase'
                                }}>
                                  {order.exchangeRequest.status}
                                </span>
                              </div>
                              
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>Update Status:</span>
                                <select
                                  value={order.exchangeRequest.status}
                                  onChange={(e) => handleExchangeStatusChange(order._id, e.target.value)}
                                  disabled={updating === order._id}
                                  className={styles.cellSelect}
                                  style={{ fontSize: '0.68rem', padding: '4px 8px' }}
                                  aria-label={`Update exchange status for ${order._id.slice(-8)}`}
                                >
                                  <option value="pending">PENDING</option>
                                  <option value="approved">APPROVED</option>
                                  <option value="rejected">REJECTED</option>
                                  <option value="completed">COMPLETED</option>
                                </select>
                              </div>
                            </div>
                            
                            <div style={{ paddingLeft: 12, borderLeft: '2px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {order.exchangeRequest.items?.map((exItem, idx) => (
                                <div key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                  • Item: <strong style={{ color: '#fff' }}>{exItem.name}</strong> — Original size: <strong>{exItem.size}</strong> ➔ Requested size: <strong style={{ color: '#4ade80' }}>{exItem.newSize}</strong>
                                  <div style={{ paddingLeft: 12, fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2, fontStyle: 'italic' }}>
                                    Reason: "{exItem.reason}"
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>Seller Notes:</span>
                              <input
                                type="text"
                                placeholder="Add seller notes (e.g. Courier dispatched...)"
                                value={exchangeNotes[order._id] !== undefined ? exchangeNotes[order._id] : (order.exchangeRequest.adminNotes || '')}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setExchangeNotes(prev => ({ ...prev, [order._id]: val }));
                                }}
                                style={{
                                  background: 'var(--bg-primary)',
                                  border: '1px solid var(--border)',
                                  color: '#fff',
                                  fontSize: '0.72rem',
                                  padding: '6px 12px',
                                  flex: 1,
                                  outline: 'none',
                                  minWidth: '200px'
                                }}
                              />
                              <button
                                className={styles.actionBtn}
                                style={{ fontSize: '0.65rem', padding: '6px 12px' }}
                                onClick={() => handleSaveExchangeNotes(order._id)}
                                disabled={updating === order._id}
                              >
                                Save Notes
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
