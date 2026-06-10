import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { Shield, Truck, RefreshCcw, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { products } from '../data/products';
import styles from './Home.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  useDocumentTitle('');

  useEffect(() => {
    // Fetch featured products
    fetch(`${API_URL}/products/featured`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setFeaturedProducts(data.data.slice(0, 4));
        } else {
          // fallback if success is false
          setFeaturedProducts(products.slice(0, 4).map(p => ({ ...p, _id: String(p.id) })));
        }
      })
      .catch(() => {
        setFeaturedProducts(products.slice(0, 4).map(p => ({ ...p, _id: String(p.id) })));
      })
      .finally(() => setLoadingProducts(false));

    // Fetch collections
    fetch(`${API_URL}/collections`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCollections(data.data.slice(0, 4));
      })
      .catch(console.error);
  }, []);

  return (
    <div className={styles.home}>
      <Hero />

      {/* Collections Section */}
      {collections.length > 0 && (
        <section className="section-padding">
          <div className="container-fluid">
            <div className="row g-4 justify-content-center">
              {collections.map((col) => (
                <div key={col._id} className="col-6 col-md">
                  <Link to={`/shop?collection=${col._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <motion.div
                      className={styles.categoryCard}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    >
                      <img src={col.image} alt={col.name} />
                      <div className={styles.categoryOverlay}>
                        <h3>{col.name}</h3>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="section-padding bg-secondary-alt">
        <div className="container-fluid">
          <div className={styles.sectionHeader}>
            <h2>LATEST ARRIVALS</h2>
            <p>ELEVATE YOUR WARDROBE WITH OUR NEWEST PIECES</p>
          </div>

          {loadingProducts ? (
            <div className={styles.loadingRow}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          ) : (
            <div className="row">
              {featuredProducts.map((product) => (
                <div key={product._id} className="col-12 col-sm-6 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/shop" className="premium-btn-outline">VIEW ALL COLLECTIONS</Link>
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className={styles.brandShowcase}>
        <div className={styles.parallaxBg}>
          <div className={styles.brandContent}>
            <h2>BEYOND FASHION</h2>
            <p>LUCIFUR IS NOT JUST A BRAND. IT'S A STATEMENT OF DARK ELEGANCE AND URBAN SUPERIORITY.</p>
            <Link to="/about" className="premium-btn">THE MANIFESTO</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container">
          <div className="row g-5">
            {[
              { icon: <Truck size={40} strokeWidth={1} />, title: 'GLOBAL SHIPPING', text: 'Express delivery to over 150 countries worldwide.' },
              { icon: <Shield size={40} strokeWidth={1} />, title: 'SECURE PAYMENT', text: '100% secure payment processing with SSL encryption.', delay: 0.2 },
              { icon: <RefreshCcw size={40} strokeWidth={1} />, title: '2-DAY EXCHANGE', text: 'No returns. Exchange available within 2 days of delivery.', delay: 0.4 },
              { icon: <Star size={40} strokeWidth={1} />, title: 'PREMIUM QUALITY', text: 'Crafted with the finest materials and attention to detail.', delay: 0.6 },
            ].map(({ icon, title, text, delay = 0 }) => (
              <div key={title} className="col-md-3 text-center">
                <motion.div
                  className={styles.featureBox}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  viewport={{ once: true }}
                  transition={{ delay }}
                >
                  {icon}
                  <h4>{title}</h4>
                  <p>{text}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
