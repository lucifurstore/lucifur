import React, { useState } from 'react';
import styles from './Contact.module.css';
import { Mail, Phone, MapPin, Instagram, MessageCircle } from 'lucide-react';
import { useDocumentTitle } from '../utils/useDocumentTitle';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  useDocumentTitle('Contact Us');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={styles.contactPage}>
      <header className={styles.contactHeader}>
        <div className="container text-center">
          <h1>GET IN TOUCH</h1>
          <p>WE ARE HERE TO ASSIST YOU</p>
        </div>
      </header>

      <section className="section-padding">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-4">
              <div className={styles.contactInfo}>
                <h2>CONTACT INFO</h2>
                <div className={styles.infoItem}>
                  <MapPin size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <h6>STORE ADDRESS</h6>
                    <p style={{ margin: 0 }}>
                      KK Heights Building, 1st Floor,<br />
                      Behind Bhadada Bagh, Mochi Market,<br />
                      Bhilwara, Rajasthan (311001)
                    </p>
                    <a 
                      href="https://maps.app.goo.gl/gCH11iQ8bU2to7pt6" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.mapLink}
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Mail size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <h6>EMAIL</h6>
                    <p style={{ margin: 0 }}>
                      <a href="mailto:lucifur.store@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                        lucifur.store@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Phone size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <h6>PHONE</h6>
                    <p style={{ margin: 0 }}>
                      <a href="tel:+917412838671" style={{ color: 'inherit', textDecoration: 'none' }}>
                        +91 74128 38671
                      </a>
                    </p>
                  </div>
                </div>

                <div className={styles.socials} style={{ flexDirection: 'column', gap: 12 }}>
                  <a 
                    href="https://www.instagram.com/lucifur.clothng?igsh=ZTd0MTBnc3J6cWpt" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', fontSize: '0.85rem' }}
                  >
                    <Instagram size={20} />
                    <span>Instagram: @lucifur.clothng</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/lucifur.in_/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', fontSize: '0.85rem' }}
                  >
                    <Instagram size={20} />
                    <span>Backup: @lucifur.in_</span>
                  </a>
                  <a 
                    href="https://whatsapp.com/channel/0029VbC24IHGzzKagp97Ce0K" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', fontSize: '0.85rem' }}
                  >
                    <MessageCircle size={20} />
                    <span>WhatsApp Channel</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className={styles.contactForm}>
                <h2>SEND A MESSAGE</h2>
                {submitted ? (
                  <div style={{ color: '#4ade80', fontSize: '0.82rem', letterSpacing: '1px', padding: '24px 20px', border: '1px solid var(--border)', background: 'rgba(74, 222, 128, 0.05)', textAlign: 'center' }}>
                    ✓ THANK YOU! YOUR MESSAGE HAS BEEN SENT SUCCESSFULLY. WE WILL RESPOND SHORTLY.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <input type="text" placeholder="FULL NAME" required />
                      </div>
                      <div className="col-md-6 mb-4">
                        <input type="email" placeholder="EMAIL ADDRESS" required />
                      </div>
                    </div>
                    <div className="mb-4">
                      <input type="text" placeholder="SUBJECT" />
                    </div>
                    <div className="mb-4">
                      <textarea placeholder="YOUR MESSAGE" rows="6" required></textarea>
                    </div>
                    <button type="submit" className="premium-btn">SEND MESSAGE</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
