import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import styles from './ProductDetails.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, openLogin } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImg, setActiveImg] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  useDocumentTitle(product ? product.name : 'Product Details');

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const p = data.data;
          setProduct(p);
          setActiveImg(p.images?.[0] || '');
          if (!p.sizes || p.sizes.length === 0) {
            setSelectedSize('ONE SIZE');
          } else {
            setSelectedSize(p.sizes[0] || '');
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) { openLogin(); return; }
    if (!selectedSize) return;
    addToCart(product, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { openLogin(); return; }
    await toggleWishlist(product);
  };

  if (loading) {
    return (
      <div className={styles.detailsPage}>
        <div className="container-fluid">
          <div className={styles.skeleton} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center section-padding">
        <p>Product not found.</p>
        <Link to="/shop" className="premium-btn mt-3">BACK TO SHOP</Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product._id);

  return (
    <div className={styles.detailsPage}>
      <div className="container-fluid">
        <nav className={styles.breadcrumb}>
          <Link to="/">HOME</Link> / <Link to="/shop">SHOP</Link> / <span className={styles.breadcrumbName}>{product.name}</span>
        </nav>

        <div className="row g-5">
          {/* Image Gallery */}
          <div className="col-lg-7">
            <div className="row g-3">
              <div className="col-md-2 col-12 order-2 order-md-1">
                <div className={styles.thumbnails}>
                  {product.images?.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className={activeImg === img ? styles.activeThumb : ''}
                      onClick={() => setActiveImg(img)}
                      alt={`${product.name} view ${i + 1}`}
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
              <div className="col-md-10 col-12 order-1 order-md-2">
                <motion.div
                  className={styles.mainImageWrapper}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={activeImg}
                >
                  <img src={activeImg} alt={product.name} className={styles.mainImage} loading="lazy" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="col-lg-5">
            <div className={styles.productInfo}>
              <span className={styles.category}>{product.category}</span>
              {product.badge && <span className={styles.badgeTag}>{product.badge}</span>}
              <h1 className={styles.title}>{product.name}</h1>
              <p className={styles.price}>₹{Number(product.price).toFixed(2)}</p>

              <div className={styles.divider} />

              <p className={styles.description}>{product.description}</p>

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className={styles.colorsSection}>
                  <span className={styles.label}>COLORS</span>
                  <div className={styles.colorsList}>
                    {product.colors.map((c) => (
                      <span key={c} className={styles.colorChip}>{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className={styles.sizeSection}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className={styles.label}>SELECT SIZE</span>
                    <button className={styles.sizeGuide}>SIZE GUIDE</button>
                  </div>
                  <div className={styles.sizeOptions}>
                    {product.sizes?.map((size) => (
                      <button
                        key={size}
                        className={`${styles.sizeBtn} ${selectedSize === size ? styles.selected : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock indicator */}
              {product.stock < 10 && product.stock > 0 && (
                <p className={styles.lowStock}>⚠ Only {product.stock} left in stock</p>
              )}
              {product.stock === 0 && (
                <p className={styles.outOfStock}>OUT OF STOCK</p>
              )}

              <div className={styles.actions}>
                <button
                  className="premium-btn w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || !selectedSize}
                >
                  <ShoppingBag size={18} />
                  {addedToCart ? '✓ ADDED TO BAG' : product.stock === 0 ? 'OUT OF STOCK' : !selectedSize ? 'SELECT A SIZE' : 'ADD TO BAG'}
                </button>
                <button
                  className={`premium-btn-outline w-100 d-flex align-items-center justify-content-center gap-2 ${wishlisted ? styles.wishlisted : ''}`}
                  onClick={handleWishlist}
                >
                  <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                  {wishlisted ? 'WISHLISTED' : 'ADD TO WISHLIST'}
                </button>
              </div>

              <div className={styles.perks}>
                {[
                  { icon: <Truck size={20} />, title: 'FREE SHIPPING', text: 'On all orders above ₹2000' },
                  { icon: <ShieldCheck size={20} />, title: 'SECURE TRANSACTION', text: 'Your data is protected by SSL' },
                  { icon: <RefreshCw size={20} />, title: '2-DAY EXCHANGE', text: 'No returns, exchange in 2 days' },
                ].map(({ icon, title, text }) => (
                  <div key={title} className={styles.perkItem}>
                    {icon}
                    <div>
                      <h6>{title}</h6>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
