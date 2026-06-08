import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styles from './Cart.module.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartSubtotal } = useCart();
  const navigate = useNavigate();

  const shipping = cartSubtotal > 2000 ? 0 : 99;
  const total = cartSubtotal + shipping;

  return (
    <div className={styles.cartPage}>
      <div className="container-fluid">
        <h1 className={styles.title}>SHOPPING BAG</h1>

        {cartItems.length > 0 ? (
          <div className="row g-5">
            {/* Items List */}
            <div className="col-lg-8">
              <div className={styles.cartHeader}>
                <span>PRODUCT</span>
                <span className="d-none d-md-block">PRICE</span>
                <span>QUANTITY</span>
                <span className="d-none d-md-block">TOTAL</span>
              </div>

              <div className={styles.itemsList}>
                {cartItems.map((item) => (
                  <div key={`${item._id}-${item.selectedSize}`} className={styles.cartItem}>
                    <div className={styles.productInfo}>
                      {item.image && (
                        <img src={item.image} alt={item.name} />
                      )}
                      <div>
                        <h3>{item.name}</h3>
                        <p>SIZE: {item.selectedSize}</p>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeFromCart(item._id, item.selectedSize)}
                        >
                          <Trash2 size={14} /> REMOVE
                        </button>
                      </div>
                    </div>

                    <div className={`${styles.price} d-none d-md-block`}>
                      ₹{item.price.toFixed(2)}
                    </div>

                    <div className={styles.quantity}>
                      <button onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.selectedSize, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className={`${styles.total} d-none d-md-block`}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/shop" className={styles.backBtn}>
                <ArrowLeft size={16} /> CONTINUE SHOPPING
              </Link>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className={styles.summaryCard}>
                <h2>ORDER SUMMARY</h2>
                <div className={styles.summaryRow}>
                  <span>SUBTOTAL</span>
                  <span>₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>SHIPPING</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className={styles.shippingHint}>
                    Add ₹{(2000 - cartSubtotal).toFixed(0)} more for free shipping
                  </p>
                )}
                <div className={styles.divider} />
                <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
                  <span>TOTAL</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <button
                  className="premium-btn w-100 mt-4 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate('/checkout')}
                >
                  <ShoppingBag size={18} /> PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <ShoppingBag size={60} strokeWidth={0.8} style={{ opacity: 0.3, marginBottom: 20 }} />
            <p style={{ letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: 24 }}>
              YOUR BAG IS EMPTY
            </p>
            <Link to="/shop" className="premium-btn">EXPLORE THE COLLECTION</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
