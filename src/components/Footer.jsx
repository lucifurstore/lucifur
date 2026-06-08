import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container-fluid">
        <div className="row g-5">
          <div className="col-lg-4">
            <div className={styles.brandSection}>
              <h2 className={styles.logo}>LUCIFER</h2>
              <p className={styles.description}>
                Premium streetwear brand defining the intersection of luxury and urban culture. Est. 2024.
              </p>
              <div className={styles.socials}>
                <a href="#"><Instagram size={20} /></a>
                <a href="#"><Twitter size={20} /></a>
                <a href="#"><Facebook size={20} /></a>
                <a href="#"><Youtube size={20} /></a>
              </div>
            </div>
          </div>
          
          <div className="col-6 col-lg-2">
            <div className={styles.linksColumn}>
              <h3>SHOP</h3>
              <ul>
                <li><Link to="/shop">ALL COLLECTIONS</Link></li>
                <li><Link to="/shop">NEW ARRIVALS</Link></li>
                <li><Link to="/shop">BEST SELLERS</Link></li>
                <li><Link to="/shop">SALE</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <div className={styles.linksColumn}>
              <h3>COMPANY</h3>
              <ul>
                <li><Link to="/about">OUR STORY</Link></li>
                <li><Link to="/contact">CONTACT US</Link></li>
                <li><Link to="/">TERMS of SERVICE</Link></li>
                <li><Link to="/">PRIVACY POLICY</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4">
            <div className={styles.newsletter}>
              <h3>NEWSLETTER</h3>
              <p>JOIN THE INNER CIRCLE FOR EXCLUSIVE DROPS AND NEWS.</p>
              <form className={styles.subscribeForm}>
                <input type="email" placeholder="EMAIL ADDRESS" required />
                <button type="submit"><Mail size={18} /></button>
              </form>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2024 LUCIFER CLOTHING. ALL RIGHTS RESERVED.</p>
          <div className={styles.payments}>
            {/* Payment icons could go here */}
            <span>VISA</span>
            <span>MASTERCARD</span>
            <span>AMEX</span>
            <span>APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
