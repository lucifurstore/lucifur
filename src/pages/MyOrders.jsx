import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './MyOrders.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_COLORS = {
  pending:   { color: '#f0c040' },
  confirmed: { color: '#60b0ff' },
  shipped:   { color: '#a78bfa' },
  delivered: { color: '#4ade80' },
  cancelled: { color: '#f87171' },
};

const MyOrders = () => {
  const { token, isAuthenticated, openLogin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    fetch(`${API_URL}/orders/myorders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { if (data.success) setOrders(data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated, token]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className="container-fluid text-center py-5">
          <Package size={60} strokeWidth={0.8} style={{ opacity: 0.3, marginBottom: 20 }} />
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

        {loading ? (
          <div className={styles.loading}>LOADING YOUR ORDERS...</div>
        ) : orders.length === 0 ? (
          <div className={styles.empty}>
            <ShoppingBag size={60} strokeWidth={0.8} style={{ opacity: 0.3, marginBottom: 20 }} />
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
                        {item.image && <img src={item.image} alt={item.name} className={styles.previewImg} />}
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
