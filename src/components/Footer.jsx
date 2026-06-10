import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MessageCircle } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [newsletterMsg, setNewsletterMsg] = React.useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    // TODO: connect to a real newsletter endpoint
    setNewsletterMsg('THANK YOU FOR SUBSCRIBING!');
    setNewsletterEmail('');
    setTimeout(() => setNewsletterMsg(''), 4000);
  };
  return (
    <footer className={styles.footer}>
      <div className="container-fluid">
        <div className="row g-5">
          <div className="col-lg-4">
            <div className={styles.brandSection}>
              <h2 className={styles.logo}>LUCIFUR</h2>
              <p className={styles.description}>
                Premium streetwear brand defining the intersection of luxury and urban culture. Shipping worldwide.
              </p>
              <div className={styles.socials} style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <a href="https://www.instagram.com/lucifur.clothng?igsh=ZTd0MTBnc3J6cWpt" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
                <a href="https://whatsapp.com/channel/0029VbC24IHGzzKagp97Ce0K" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Channel"><MessageCircle size={20} /></a>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.6', letterSpacing: '1px', margin: 0 }}>
                <strong>Store:</strong> KK Heights Building, 1st Floor, behind Bhadada Bagh, Mochi Market, Bhilwara (Rajasthan)<br />
                <strong>Phone:</strong> <a href="tel:+917412838671" style={{ color: 'inherit', textDecoration: 'none' }}>+91 74128 38671</a><br />
                <strong>Backup IG:</strong> <a href="https://www.instagram.com/lucifur.in_/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>@lucifur.in_</a>
              </p>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <div className={styles.linksColumn}>
              <h3>SHOP</h3>
              <ul>
                <li><Link to="/shop">ALL COLLECTIONS</Link></li>
                <li><Link to="/shop?sort=new">NEW ARRIVALS</Link></li>
                <li><Link to="/shop?filter=BEST SELLER">BEST SELLERS</Link></li>
                <li><Link to="/shop?filter=SALE">SALE</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <div className={styles.linksColumn}>
              <h3>COMPANY</h3>
              <ul>
                <li><Link to="/about">OUR STORY</Link></li>
                <li><Link to="/contact">CONTACT US</Link></li>
                <li><Link to="/terms">TERMS OF SERVICE</Link></li>
                <li><Link to="/privacy">PRIVACY POLICY</Link></li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4">
            <div className={styles.newsletter}>
              <h3>NEWSLETTER</h3>
              <p>JOIN THE INNER CIRCLE FOR EXCLUSIVE DROPS AND NEWS.</p>
              <form className={styles.subscribeForm} onSubmit={handleNewsletter}>
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button type="submit"><Mail size={18} /></button>
              </form>
              {newsletterMsg && <p style={{ fontSize: '0.7rem', letterSpacing: '1px', color: '#4ade80', marginTop: 8 }}>{newsletterMsg}</p>}
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; 2024 LUCIFUR CLOTHING. ALL RIGHTS RESERVED.</p>
          <div className={styles.payments}>
            {/* Payment icons could go here */}
            <span>VISA</span>
            <span>MASTERCARD</span>
            <span>AMEX</span>
            <span>APPLE PAY</span>
          </div>
        </div>
        <p className={styles.credits}>
          DESIGNED & DEVELOPED BY <strong>NIYEXA WEB STUDIO</strong> &mdash; JIYA VAJA, NANDIK PATEL & VINAYAK BOKADE
        </p>
      </div>
    </footer>
  );
};

export default Footer;
