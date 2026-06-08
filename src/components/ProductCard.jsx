import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const { isAuthenticated, openLogin } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Normalise between API shape (_id, images[]) and mock shape (id, image)
  const productId = product._id || product.id;
  const mainImage = product.images?.[0] || product.image || '';
  const hoverImage = product.images?.[1] || product.hoverImage || mainImage;
  const wishlisted = product._id ? isWishlisted(product._id) : false;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { openLogin(); return; }
    // Default size S — user can change on Product Details page
    addToCart({ ...product, _id: productId }, 'M');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { openLogin(); return; }
    await toggleWishlist({ ...product, _id: productId });
  };

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/product/${productId}`} className={styles.imageWrapper}>
        <img src={mainImage} alt={product.name} className={styles.mainImg} />
        <img src={hoverImage} alt={product.name} className={styles.hoverImg} />

        {product.badge && <span className={styles.badge}>{product.badge}</span>}

        <div className={styles.overlay}>
          <button
            className={`${styles.iconBtn} ${wishlisted ? styles.iconBtnActive : ''}`}
            onClick={handleWishlist}
            title="Add to Wishlist"
          >
            <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
          <button className={styles.iconBtn} onClick={handleAddToCart} title="Add to Cart">
            <ShoppingCart size={20} />
          </button>
        </div>
      </Link>

      <div className={styles.info}>
        <p className={styles.category}>{product.category}</p>
        <Link to={`/product/${productId}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        <p className={styles.price}>₹{Number(product.price).toFixed(2)}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
