import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import styles from './MyOrders.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_COLORS = {
  pending: { color: '#f0c040' },
  confirmed: { color: '#60b0ff' },
  shipped: { color: '#a78bfa' },
  delivered: { color: '#4ade80' },
  cancelled: { color: '#f87171' },
};

const MyOrders = () => {
  const { isAuthenticated, openLogin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();
  const justOrdered = location.state?.fromOrder;

  const [exchangeOrder, setExchangeOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [submittingExchange, setSubmittingExchange] = useState(false);
  const [exchangeError, setExchangeError] = useState('');

  useDocumentTitle('My Orders');

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    const currentToken = localStorage.getItem('userToken');
    if (!currentToken) { setLoading(false); return; }

    setLoading(true);
    setError(false);
    fetch(`${API_URL}/orders/myorders`, {
      headers: { Authorization: `Bearer ${currentToken}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch orders');
        return r.json();
      })
      .then((data) => {
        if (data.success) {
          setOrders(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch orders');
        }
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, location.key, refreshKey]);

  const openExchangeModal = (order) => {
    setExchangeOrder(order);
    const initialSelection = {};
    order.orderItems.forEach((item) => {
      initialSelection[item._id] = {
        selected: false,
        product: item.product,
        name: item.name,
        size: item.size,
        newSize: item.size,
        reason: '',
      };
    });
    setSelectedItems(initialSelection);
    setExchangeError('');
  };

  const handleExchangeSubmit = async (e) => {
    e.preventDefault();
    setExchangeError('');

    const itemsToExchange = Object.values(selectedItems)
      .filter((item) => item.selected)
      .map((item) => ({
        product: item.product,
        name: item.name,
        size: item.size,
        newSize: item.newSize,
        reason: item.reason,
      }));

    if (itemsToExchange.length === 0) {
      setExchangeError('Please select at least one item to exchange.');
      return;
    }

    const hasEmptyReason = itemsToExchange.some((item) => !item.reason.trim());
    if (hasEmptyReason) {
      setExchangeError('Please provide a reason for exchange for all selected items.');
      return;
    }

    setSubmittingExchange(true);
    const currentToken = localStorage.getItem('userToken');
    try {
      const res = await fetch(`${API_URL}/orders/${exchangeOrder._id}/exchange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ items: itemsToExchange }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit exchange');

      setExchangeOrder(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setExchangeError(err.message);
    } finally {
      setSubmittingExchange(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className="container-fluid text-center py-5">
          <Package size={60} strokeWidth={0.8} style={{ opacity: 0.3, marginBottom: 20, display: 'block', margin: '0 auto' }} />
          <p style={{ letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: 24 }}>
            SIGN IN TO VIEW YOUR ORDERS
          </p>
          <button className="premium-btn" onClick={openLogin}>SIGN IN</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container-fluid">
        <h1 className={styles.title}>MY ORDERS</h1>

        {justOrdered && orders.length > 0 && (
          <div style={{
            background: 'rgba(74, 222, 128, 0.1)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            color: '#4ade80',
            padding: '12px 20px',
            fontSize: '0.75rem',
            letterSpacing: '2px',
            marginBottom: 24,
            textAlign: 'center',
          }}>
            ✓ YOUR ORDER HAS BEEN PLACED SUCCESSFULLY
          </div>
        )}

        {error ? (
          <div className={styles.empty}>
            <Package size={60} strokeWidth={0.8} style={{ opacity: 0.3, marginBottom: 20, display: 'block', margin: '0 auto' }} />
            <p style={{ letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: 24 }}>
              COULD NOT LOAD ORDERS. PLEASE TRY AGAIN.
            </p>
            <button
              className="premium-btn"
              onClick={() => {
                setError(false);
                setRefreshKey((k) => k + 1);
              }}
            >
              RETRY
            </button>
          </div>
        ) : loading ? (
          <div className={styles.loading}>LOADING YOUR ORDERS...</div>
        ) : orders.length === 0 ? (
          <div className={styles.empty}>
            <ShoppingBag size={60} strokeWidth={0.8} style={{ opacity: 0.3, marginBottom: 20, display: 'block', margin: '0 auto' }} />
            <p>YOU HAVEN'T PLACED ANY ORDERS YET</p>
            <Link to="/shop" className="premium-btn" style={{ marginTop: 24 }}>START SHOPPING</Link>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => {
              const statusStyle = STATUS_COLORS[order.status] || {};
              return (
                <div key={order._id} className={styles.orderCard}>
                  {/* Header */}
                  <div className={styles.orderHeader}>
                    <div>
                      <span className={styles.orderIdLabel}>ORDER</span>
                      <span className={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className={styles.orderMeta}>
                      <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                      <span className={styles.statusBadge} style={{ color: statusStyle.color, borderColor: statusStyle.color }}>
                        {order.status?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className={styles.itemsPreview}>
                    {order.orderItems?.slice(0, 3).map((item, i) => (
                      <div key={i} className={styles.previewItem}>
                        {item.image && <img src={item.image} alt={item.name} className={styles.previewImg} loading="lazy" />}
                        <div>
                          <p className={styles.previewName}>{item.name}</p>
                          <p className={styles.previewMeta}>
                            SIZE: {item.size} · QTY: {item.quantity} · ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.orderItems?.length > 3 && (
                      <p className={styles.moreItems}>+{order.orderItems.length - 3} more items</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className={styles.orderFooter}>
                    <div>
                      <span className={styles.totalLabel}>TOTAL PAID</span>
                      <span className={styles.totalAmount}>₹{order.totalAmount?.toFixed(2)}</span>
                    </div>
                    <div className={styles.paymentStatus} style={{
                      color: order.paymentStatus === 'paid' ? '#4ade80' : 'var(--text-secondary)',
                    }}>
                      {order.paymentStatus?.toUpperCase()}
                    </div>
                  </div>

                  {/* Exchange Request section or button */}
                  {order.exchangeRequest?.isRequested ? (
                    <div className={styles.exchangeSection}>
                      <div className={styles.exchangeHeader}>
                        <span className={styles.exchangeTitle}>Exchange Request</span>
                        <span
                          className={styles.exchangeBadge}
                          style={{
                            color: order.exchangeRequest.status === 'pending' ? '#f0c040' :
                              order.exchangeRequest.status === 'approved' ? '#60b0ff' :
                                order.exchangeRequest.status === 'rejected' ? '#f87171' : '#4ade80',
                            borderColor: order.exchangeRequest.status === 'pending' ? 'rgba(240,192,64,0.3)' :
                              order.exchangeRequest.status === 'approved' ? 'rgba(96,176,255,0.3)' :
                                order.exchangeRequest.status === 'rejected' ? 'rgba(248,113,113,0.3)' : 'rgba(74,222,128,0.3)',
                            background: order.exchangeRequest.status === 'pending' ? 'rgba(240,192,64,0.08)' :
                              order.exchangeRequest.status === 'approved' ? 'rgba(96,176,255,0.08)' :
                                order.exchangeRequest.status === 'rejected' ? 'rgba(248,113,113,0.08)' : 'rgba(74,222,128,0.08)',
                          }}
                        >
                          {order.exchangeRequest.status}
                        </span>
                      </div>
                      {order.exchangeRequest.items?.map((exItem, idx) => (
                        <div key={idx} className={styles.exchangeItemInfo}>
                          • {exItem.name} (Size: {exItem.size} ➔ {exItem.newSize}) — Reason: "{exItem.reason}"
                        </div>
                      ))}
                      {order.exchangeRequest.adminNotes && (
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: 8, fontStyle: 'italic' }}>
                          Seller Notes: {order.exchangeRequest.adminNotes}
                        </div>
                      )}
                    </div>
                  ) : order.status === 'delivered' && (
                    ((new Date() - new Date(order.deliveredAt || order.updatedAt)) / (1000 * 60 * 60 * 24) <= 2)
                  ) ? (
                    <div style={{ padding: '0 24px 20px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        className="premium-btn"
                        style={{ fontSize: '0.68rem', padding: '8px 16px', letterSpacing: '1px' }}
                        onClick={() => openExchangeModal(order)}
                      >
                        REQUEST EXCHANGE
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Exchange Dialog Modal */}
      {exchangeOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Request Exchange</h2>
            {exchangeError && <div className={styles.modalError}>{exchangeError}</div>}

            <form onSubmit={handleExchangeSubmit}>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: 20, letterSpacing: '0.5px' }}>
                Select the item(s) you would like to exchange, select the new desired size, and describe the reason.
              </p>

              {exchangeOrder.orderItems.map((item) => {
                const itemState = selectedItems[item._id] || {};
                return (
                  <div key={item._id} className={styles.modalItemRow}>
                    <label className={styles.modalItemHeader}>
                      <input
                        type="checkbox"
                        className={styles.checkboxInput}
                        checked={!!itemState.selected}
                        onChange={(e) => {
                          setSelectedItems(prev => ({
                            ...prev,
                            [item._id]: { ...prev[item._id], selected: e.target.checked }
                          }));
                        }}
                      />
                      <span style={{ fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.5px' }}>
                        {item.name} (Original Size: {item.size})
                      </span>
                    </label>

                    {itemState.selected && (
                      <div className={styles.modalItemDetails}>
                        <div className={styles.modalFormGroup}>
                          <label className={styles.modalLabel}>New Size</label>
                          <select
                            className={styles.modalSelect}
                            value={itemState.newSize}
                            onChange={(e) => {
                              setSelectedItems(prev => ({
                                ...prev,
                                [item._id]: { ...prev[item._id], newSize: e.target.value }
                              }));
                            }}
                          >
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                        <div className={styles.modalFormGroup}>
                          <label className={styles.modalLabel}>Reason</label>
                          <input
                            type="text"
                            placeholder="e.g. Too small, too large..."
                            className={styles.modalInput}
                            value={itemState.reason}
                            onChange={(e) => {
                              setSelectedItems(prev => ({
                                ...prev,
                                [item._id]: { ...prev[item._id], reason: e.target.value }
                              }));
                            }}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setExchangeOrder(null)}
                  disabled={submittingExchange}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.modalSubmitBtn}
                  disabled={submittingExchange}
                >
                  {submittingExchange ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
