import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import styles from './NotFound.module.css';

const NotFound = () => {
  useDocumentTitle('Page Not Found');

  return (
    <div className={styles.notFoundPage}>
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={styles.contentCard}
            >
              <h1 className={styles.title}>404</h1>
              <h2 className={styles.subtitle}>Lost in the Shadows</h2>
              <p className={styles.description}>
                The page you are looking for does not exist or has been moved to another coordinate.
              </p>
              <Link to="/" className="premium-btn">
                Back to Home
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
