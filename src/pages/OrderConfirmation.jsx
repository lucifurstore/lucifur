import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { CheckCircle, Package, MapPin, ShoppingBag } from 'lucide-react';
import styles from './OrderConfirmation.module.css';

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  const shortId = id?.slice(-8).toUpperCase();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Success Icon */}
        <div className={styles.iconWrap}>
          <CheckCircle size={56} strokeWidth={1.2} />
        </div>

        <h1 className={styles.heading}>ORDER PLACED!</h1>
        <p className={styles.sub}>Thank you for your purchase. We'll get it ready soon.</p>

        <div className={styles.orderId}>
          <span className={styles.orderLabel}>ORDER ID</span>
          <span className={styles.orderValue}>#{shortId}</span>
        </div>

        {order && (
          <>
            {/* Address */}
            <div className={styles.infoBlock}>
              <div className={styles.infoTitle}>
                <MapPin size={14} /> Shipping To
              </div>
              <p className={styles.infoText}>
                {order.shippingAddress?.fullName}<br />
                {order.shippingAddress?.street}
                {order.shippingAddress?.apartment ? `, ${order.shippingAddress.apartment}` : ''}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.zipCode}<br />
                {order.shippingAddress?.country}
              </p>
            </div>

            {/* Items */}
            <div className={styles.infoBlock}>
              <div className={styles.infoTitle}>
                <Package size={14} /> Items Ordered
              </div>
              {order.orderItems?.map((item, i) => (
                <div key={i} className={styles.orderItem}>
                  {item.image && <img src={item.image} alt={item.name} className={styles.itemImg} />}
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemMeta}>SIZE: {item.size} · QTY: {item.quantity}</p>
                  </div>
                  <span className={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span><span>₹{order.subtotal?.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span>
              </div>
              {order.discount > 0 && (
                <div className={`${styles.totalRow} ${styles.discountRow}`}>
                  <span>Discount</span><span>−₹{order.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className={styles.grandTotal}>
                <span>TOTAL</span><span>₹{order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}

        <div className={styles.actions}>
          <Link to="/orders" className="premium-btn-outline">
            <Package size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            VIEW MY ORDERS
          </Link>
          <Link to="/shop" className="premium-btn">
            <ShoppingBag size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
