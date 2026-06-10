import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../utils/useDocumentTitle';

const Terms = () => {
  useDocumentTitle('Terms of Service');
  return (
    <div style={{ paddingTop: '140px', paddingBottom: '100px', minHeight: '80vh' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p style={{ fontSize: '0.75rem', letterSpacing: '3px', color: 'var(--text-secondary)', marginBottom: 16 }}>
            <Link to="/" style={{ color: 'var(--text-secondary)' }}>HOME</Link>
            {' '}/ TERMS OF SERVICE
          </p>
          <h1 style={{ fontSize: '2.5rem', letterSpacing: '4px', marginBottom: 40 }}>TERMS OF SERVICE</h1>

          <div style={{ maxWidth: 720, color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.95rem' }}>
            <p style={{ marginBottom: 32 }}>
              Last updated: June 2024
            </p>

            {[
              {
                title: '1. ACCEPTANCE OF TERMS',
                body: 'By accessing or using the Lucifur website and services, you agree to be bound by these Terms of Service. If you do not agree to all the terms, please do not use our services.',
              },
              {
                title: '2. USE OF THE SITE',
                body: 'You agree to use this site only for lawful purposes and in a manner that does not infringe the rights of others. Unauthorized use of this website may give rise to a claim for damages or be a criminal offence.',
              },
              {
                title: '3. PRODUCT INFORMATION',
                body: 'We strive to ensure all product descriptions, images, and prices are accurate. However, we reserve the right to correct any errors and to change or update information at any time without notice.',
              },
              {
                title: '4. ORDERS & PAYMENTS',
                body: 'By placing an order, you represent that you are authorised to use the payment method provided. We reserve the right to refuse or cancel any order at our discretion.',
              },
              {
                title: '5. RETURNS & EXCHANGES',
                body: 'We do not accept returns or offer refunds. However, we offer exchanges for unworn items in original condition with tags attached within 2 days of delivery. Please contact us at lucifur.store@gmail.com to initiate an exchange.',
              },
              {
                title: '6. INTELLECTUAL PROPERTY',
                body: 'All content on this site — including text, graphics, logos, and images — is the property of Lucifur Clothing and is protected by applicable intellectual property laws.',
              },
              {
                title: '7. LIMITATION OF LIABILITY',
                body: 'To the fullest extent permitted by law, Lucifur Clothing shall not be liable for any indirect, incidental, or consequential damages arising from your use of our products or services.',
              },
              {
                title: '8. CHANGES TO TERMS',
                body: 'We reserve the right to update these Terms of Service at any time. Continued use of the site after changes constitutes acceptance of the new terms.',
              },
              {
                title: '9. CONTACT',
                body: 'For questions regarding these terms, please contact us at lucifur.store@gmail.com or visit our Contact page.',
              },
            ].map(({ title, body }) => (
              <div key={title} style={{ marginBottom: 36 }}>
                <h3 style={{ fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--text-primary)', marginBottom: 12 }}>
                  {title}
                </h3>
                <p style={{ margin: 0 }}>{body}</p>
              </div>
            ))}

            <div style={{ marginTop: 60, paddingTop: 30, borderTop: '1px solid var(--border)' }}>
              <Link to="/" className="premium-btn-outline" style={{ fontSize: '0.75rem' }}>
                BACK TO HOME
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
