import React from 'react';
import styles from './About.module.css';
import { motion } from 'framer-motion';
import { useDocumentTitle } from '../utils/useDocumentTitle';

const About = () => {
  useDocumentTitle('Our Story');
  return (
    <div className={styles.aboutPage}>
      <header className={styles.aboutHero}>
        <div className="container text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            OUR STORY
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            CRAFTING THE FUTURE OF STREETWEAR
          </motion.p>
        </div>
      </header>

      <section className="section-padding">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6">
              <img 
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop" 
                alt="Workshop" 
                className={styles.aboutImg}
              />
            </div>
            <div className="col-md-6">
              <div className={styles.aboutContent}>
                <h2>THE MANIFESTO</h2>
                <p>
                  Founded in 2024, LUCIFUR was born from a desire to bridge the gap between high-end luxury and raw urban streetwear. Our pieces are designed for those who navigate the world with confidence and a taste for the darker side of elegance.
                </p>
                <p>
                  Every garment is a testament to our commitment to quality. We source the finest materials from across the globe, ensuring that each piece not only looks exceptional but stands the test of time and trend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.visionSection}>
        <div className="container">
          <div className="row text-center justify-content-center">
            <div className="col-lg-8">
              <h2>OUR VISION</h2>
              <p>
                To redefine the urban wardrobe by infusing it with architectural precision and a rebellious spirit. We don't just follow trends; we create the artifacts of a new cultural movement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
