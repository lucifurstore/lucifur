import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { heroSlides } from '../data/products';
import styles from './Hero.module.css';

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.hero}>
      <AnimatePresence mode="wait">
        <motion.div 
          key={current}
          className={styles.slide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div 
            className={styles.bgImage} 
            style={{ backgroundImage: `url(${heroSlides[current].image})` }}
          />
          <div className={styles.overlay} />
          
          <div className="container h-100 d-flex align-items-center justify-content-end">
            <div className={styles.content}>
              <motion.h4
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {heroSlides[current].subtitle}
              </motion.h4>
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {heroSlides[current].title}
              </motion.h1>
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <Link to="/shop" className="premium-btn">
                  {heroSlides[current].cta}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className={styles.indicators}>
        {heroSlides.map((_, index) => (
          <div 
            key={index} 
            className={`${styles.dot} ${index === current ? styles.active : ''}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
