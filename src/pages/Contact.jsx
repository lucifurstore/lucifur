import React from 'react';
import styles from './Contact.module.css';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

const Contact = () => {
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
                  <MapPin size={24} />
                  <div>
                    <h6>HEADQUARTERS</h6>
                    <p>123 Luxury Lane, Fashion District<br />New York, NY 10001</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Mail size={24} />
                  <div>
                    <h6>EMAIL</h6>
                    <p>support@lucifer.com</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Phone size={24} />
                  <div>
                    <h6>PHONE</h6>
                    <p>+1 (888) 582-4337</p>
                  </div>
                </div>

                <div className={styles.socials}>
                  <a href="#"><Instagram /></a>
                  <a href="#"><Twitter /></a>
                  <a href="#"><Facebook /></a>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className={styles.contactForm}>
                <h2>SEND A MESSAGE</h2>
                <form>
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
