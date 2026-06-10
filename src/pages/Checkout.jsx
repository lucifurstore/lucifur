import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import styles from './Checkout.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const defaultAddress = {
  fullName: '', email: '', phone: '',
  street: '', apartment: '', city: '',
  state: '', zipCode: '', country: 'India',
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle('Checkout');

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
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const shipping = cartSubtotal > 2000 ? 0 : 99;
  const discount = couponStatus?.discount || 0;
  const total = cartSubtotal - discount + shipping;

  const handleAddressChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponStatus(null);
    try {
      const currentToken = localStorage.getItem('userToken') || token;
      const res = await fetch(`${API_URL}/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
        },
        body: JSON.stringify({ code: couponCode.trim(), subtotal: cartSubtotal }),
      });
      if (res.status === 404) {
        throw new Error('Coupon validation unavailable');
      }
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error('Coupon validation unavailable');
      }
      if (!res.ok) throw new Error(data.message || 'Invalid coupon');
      const discountAmount = data.data?.discount || 0;
      setCouponStatus({ discount: discountAmount, message: `✓ Coupon applied — ₹${discountAmount.toFixed(2)} off!` });
    } catch (e) {
      setCouponStatus({ error: true, discount: 0, message: e.message });
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

    const currentToken = localStorage.getItem('userToken') || token;
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress: address,
          couponCode: (couponStatus && !couponStatus.error) ? couponCode.trim() : undefined,
          notes,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order failed');

      if (paymentMethod === 'Razorpay') {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          throw new Error('Razorpay SDK failed to load. Please check your network connection.');
        }

        const options = {
          key: data.razorpayKeyId,
          amount: Math.round(data.data.totalAmount * 100),
          currency: 'INR',
          name: 'LUCIFUR CLOTHING',
          description: 'Order Payment',
          order_id: data.data.razorpayOrderId,
          handler: async function (response) {
            try {
              setLoading(true);
              const verifyRes = await fetch(`${API_URL}/orders/verify`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) {
                throw new Error(verifyData.message || 'Payment verification failed');
              }

              clearCart();
              navigate(`/order-confirmation/${verifyData.data._id}`, { state: { order: verifyData.data } });
            } catch (verifyErr) {
              setError(verifyErr.message);
              setLoading(false);
            }
          },
          prefill: {
            name: address.fullName,
            email: address.email,
            contact: address.phone,
          },
          config: {
            display: {
              hide: [
                { method: 'card' },
                { method: 'netbanking' },
                { method: 'wallet' },
                { method: 'emi' },
                { method: 'paylater' }
              ],
              preferences: {
                show_default_blocks: true,
              },
            },
          },
          theme: {
            color: '#111111',
          },
          modal: {
            ondismiss: function () {
              setError('Payment cancelled by user');
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        clearCart();
        navigate(`/order-confirmation/${data.data._id}`, { state: { order: data.data } });
      }
    } catch (err) {
      setError(err.message);
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
                      placeholder="John Doe" autoComplete="name" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone Number *</label>
                    <input name="phone" value={address.phone} onChange={handleAddressChange}
                      placeholder="+91 9999999999" autoComplete="tel"
                      pattern="[\+]?[\d\s\-]{10,15}"
                      title="Please enter a valid phone number"
                      required />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address *</label>
                  <input name="email" type="email" value={address.email} onChange={handleAddressChange}
                    placeholder="you@example.com" autoComplete="email" required />
                </div>
              </div>

              {/* Shipping Address */}
              <div className={styles.formSection}>
                <h2>Shipping Address</h2>
                <div className={styles.formGroup}>
                  <label>Street Address *</label>
                  <input name="street" value={address.street} onChange={handleAddressChange}
                    placeholder="123 Main Street" autoComplete="street-address" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Apartment / Floor (optional)</label>
                  <input name="apartment" value={address.apartment} onChange={handleAddressChange}
                    placeholder="Apt 4B, Floor 2..." autoComplete="address-line2" />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>City *</label>
                    <input name="city" value={address.city} onChange={handleAddressChange}
                      placeholder="Mumbai" autoComplete="address-level2" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>State *</label>
                    <input name="state" value={address.state} onChange={handleAddressChange}
                      placeholder="Maharashtra" autoComplete="address-level1" required />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>PIN / ZIP Code *</label>
                    <input name="zipCode" value={address.zipCode} onChange={handleAddressChange}
                      placeholder="400001" autoComplete="postal-code"
                      pattern="[0-9]{6}"
                      title="PIN code must be 6 digits"
                      required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Country</label>
                    <select name="country" value={address.country} onChange={handleAddressChange} autoComplete="country-name">
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

              <div className={styles.formSection}>
                <h2>Payment Method</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, fontSize: '0.85rem', letterSpacing: '1px' }}>
                  <span>Cash on Delivery (COD)</span>
                </div>
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
                    {item.image && <img src={item.image} alt={item.name} loading="lazy" />}
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
                  🔒 Secure checkout · 2-day exchanges only
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
