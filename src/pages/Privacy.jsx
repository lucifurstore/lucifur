import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../utils/useDocumentTitle';

const Privacy = () => {
  useDocumentTitle('Privacy Policy');
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
            {' '}/ PRIVACY POLICY
          </p>
          <h1 style={{ fontSize: '2.5rem', letterSpacing: '4px', marginBottom: 40 }}>PRIVACY POLICY</h1>

          <div style={{ maxWidth: 720, color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '0.95rem' }}>
            <p style={{ marginBottom: 32 }}>
              Last updated: June 2024
            </p>

            {[
              {
                title: '1. INFORMATION WE COLLECT',
                body: 'We collect information you provide directly to us, such as your name, email address, phone number, and shipping address when you place an order or create an account.',
              },
              {
                title: '2. HOW WE USE YOUR INFORMATION',
                body: 'We use the information we collect to process orders, send transactional emails, provide customer support, and improve our products and services. We do not sell your personal data to third parties.',
              },
              {
                title: '3. COOKIES',
                body: 'We use cookies and similar tracking technologies to enhance your browsing experience and analyse traffic. You can disable cookies in your browser settings, though some features may not function correctly.',
              },
              {
                title: '4. DATA SHARING',
                body: 'We may share your information with trusted third-party service providers (e.g., payment processors, shipping partners) strictly to fulfil your orders. These parties are obligated to keep your data confidential.',
              },
              {
                title: '5. DATA SECURITY',
                body: 'We implement industry-standard security measures, including SSL encryption, to protect your personal information. However, no method of transmission over the internet is 100% secure.',
              },
              {
                title: '6. DATA RETENTION',
                body: 'We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, unless a longer retention period is required by law.',
              },
              {
                title: '7. YOUR RIGHTS',
                body: 'You have the right to access, correct, or delete the personal data we hold about you. To exercise these rights, please contact us at lucifur.store@gmail.com.',
              },
              {
                title: '8. THIRD-PARTY LINKS',
                body: 'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites and encourage you to review their policies.',
              },
              {
                title: '9. CHANGES TO THIS POLICY',
                body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our website or sending an email to the address associated with your account.',
              },
              {
                title: '10. CONTACT US',
                body: 'If you have any questions about this Privacy Policy, please reach out at lucifur.store@gmail.com or through our Contact page.',
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

export default Privacy;
