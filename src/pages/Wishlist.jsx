import React from 'react';
import { Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import styles from './Wishlist.module.css';

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const { isAuthenticated, openLogin } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className={styles.wishlistPage}>
        <div className="container-fluid text-center py-5">
          <Heart size={60} strokeWidth={0.8} style={{ opacity: 0.3, marginBottom: 20 }} />
          <p style={{ letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: 24 }}>
            SIGN IN TO SEE YOUR WISHLIST
          </p>
          <button className="premium-btn" onClick={openLogin}>SIGN IN</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wishlistPage}>
      <div className="container-fluid">
        <h1 className={styles.title}>MY WISHLIST</h1>
        <p className={styles.count}>{wishlist.length} ITEM{wishlist.length !== 1 ? 'S' : ''}</p>

        {wishlist.length > 0 ? (
          <div className="row g-4">
            {wishlist.map((product) => (
              <div key={product._id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <Heart size={60} strokeWidth={0.8} style={{ opacity: 0.3, marginBottom: 20 }} />
            <p style={{ letterSpacing: '2px', color: 'var(--text-secondary)', marginBottom: 24 }}>
              YOUR WISHLIST IS EMPTY
            </p>
            <Link to="/shop" className="premium-btn">EXPLORE THE COLLECTION</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
