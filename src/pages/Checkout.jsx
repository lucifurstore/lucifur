import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './Checkout.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const defaultAddress = {
  fullName: '', email: '', phone: '',
  street: '', apartment: '', city: '',
  state: '', zipCode: '', country: 'India',
};

const Checkout = () => {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    ...defaultAddress,
    fullName: user?.name || '',
    email: user?.email || '',
  });
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState(null); // null | { discount, message }
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shipping = cartSubtotal > 2000 ? 0 : 99;
  const discount = couponStatus?.discount || 0;
  const total = cartSubtotal - discount + shipping;

  const handleAddressChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      // We validate by attempting to use it (the order API will validate)
      // For UI, just store it; actual validation happens on order submit
      setCouponStatus({ discount: 0, message: '✓ Coupon will be applied on checkout' });
    } catch (e) {
      setCouponStatus({ error: true, message: e.message });
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setError('');
    setLoading(true);

    const orderItems = cartItems.map((item) => ({
      product: item._id,
      name: item.name,
      image: item.image,
      price: item.price,
      size: item.selectedSize,
      quantity: item.quantity,
    }));

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress: address,
          couponCode: couponCode.trim() || undefined,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order failed');

      clearCart();
      navigate(`/order-confirmation/${data.data._id}`, { state: { order: data.data } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.checkoutPage}>
        <div className="container-fluid text-center py-5">
          <p style={{ letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: 24 }}>
            YOUR BAG IS EMPTY
          </p>
          <Link to="/shop" className="premium-btn">GO SHOPPING</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className="container-fluid">
        <h1 className={styles.title}>CHECKOUT</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="row g-5">
            {/* LEFT — Address Form */}
            <div className="col-lg-7">
              {/* Contact */}
              <div className={styles.formSection}>
                <h2>Contact Information</h2>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Full Name *</label>
                    <input name="fullName" value={address.fullName} onChange={handleAddressChange}
                      placeholder="John Doe" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone Number *</label>
                    <input name="phone" value={address.phone} onChange={handleAddressChange}
                      placeholder="+91 9999999999" required />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address *</label>
                  <input name="email" type="email" value={address.email} onChange={handleAddressChange}
                    placeholder="you@example.com" required />
                </div>
              </div>

              {/* Shipping Address */}
              <div className={styles.formSection}>
                <h2>Shipping Address</h2>
                <div className={styles.formGroup}>
                  <label>Street Address *</label>
                  <input name="street" value={address.street} onChange={handleAddressChange}
                    placeholder="123 Main Street" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Apartment / Floor (optional)</label>
                  <input name="apartment" value={address.apartment} onChange={handleAddressChange}
                    placeholder="Apt 4B, Floor 2..." />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>City *</label>
                    <input name="city" value={address.city} onChange={handleAddressChange}
                      placeholder="Mumbai" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>State *</label>
                    <input name="state" value={address.state} onChange={handleAddressChange}
                      placeholder="Maharashtra" required />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>PIN / ZIP Code *</label>
                    <input name="zipCode" value={address.zipCode} onChange={handleAddressChange}
                      placeholder="400001" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Country</label>
                    <select name="country" value={address.country} onChange={handleAddressChange}>
                      <option>India</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>UAE</option>
                      <option>Singapore</option>
                      <option>Canada</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className={styles.formSection}>
                <h2>Promo Code</h2>
                <div className={styles.couponRow}>
                  <input
                    className={styles.couponInput}
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponStatus(null); }}
                    placeholder="ENTER COUPON CODE"
                  />
                  <button type="button" className={styles.couponBtn} onClick={applyCoupon}>
                    APPLY
                  </button>
                </div>
                {couponStatus && !couponStatus.error && (
                  <p className={styles.couponSuccess}>{couponStatus.message}</p>
                )}
                {couponStatus?.error && (
                  <p className={styles.couponError}>{couponStatus.message}</p>
                )}
              </div>

              {/* Order Notes */}
              <div className={styles.formSection}>
                <h2>Order Notes (Optional)</h2>
                <textarea
                  className={styles.noteInput}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions for your order..."
                />
              </div>

              {/* Payment */}
              <div className={styles.formSection}>
                <h2>Payment Method</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="radio" id="cod" name="payment" defaultChecked readOnly />
                  <label htmlFor="cod" style={{ fontSize: '0.85rem', letterSpacing: '1px', cursor: 'pointer' }}>
                    Cash on Delivery (COD)
                  </label>
                </div>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: 8, letterSpacing: '1px' }}>
                  Online payment gateway coming soon.
                </p>
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}

              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', letterSpacing: '1px', color: 'var(--text-secondary)' }}>
                  <ArrowLeft size={14} /> BACK TO CART
                </Link>
              </div>
            </div>

            {/* RIGHT — Order Summary */}
            <div className="col-lg-5">
              <div className={styles.summaryCard}>
                <h2>Your Order ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</h2>

                {cartItems.map((item) => (
                  <div key={`${item._id}-${item.selectedSize}`} className={styles.orderItem}>
                    {item.image && <img src={item.image} alt={item.name} />}
                    <div className={styles.orderItemInfo}>
                      <p className={styles.orderItemName}>{item.name}</p>
                      <p className={styles.orderItemMeta}>
                        SIZE: {item.selectedSize} · QTY: {item.quantity}
                      </p>
                    </div>
                    <span className={styles.orderItemPrice}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className={styles.divider} />

                <div className={styles.summaryRow}>
                  <span>SUBTOTAL</span>
                  <span>₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>SHIPPING</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                {discount > 0 && (
                  <div className={`${styles.summaryRow} ${styles.discount}`}>
                    <span>COUPON DISCOUNT</span>
                    <span>−₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className={styles.divider} />
                <div className={styles.grandTotal}>
                  <span>TOTAL</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                <button type="submit" className={styles.placeOrderBtn} disabled={loading}>
                  {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                </button>

                <p style={{ fontSize: '0.62rem', letterSpacing: '1px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: 14 }}>
                  🔒 Secure checkout · 30-day returns
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
