import React from 'react';
import styles from './AnnouncementStrip.module.css';

const AnnouncementStrip = () => {
  return (
    <div className={styles.strip}>
      <div className={styles.scrollingContent}>
        <span>FREE WORLDWIDE SHIPPING ON ORDERS OVER $200 — </span>
        <span>NEW SUMMER DROP IS LIVE — </span>
        <span>UP TO 40% OFF SELECT ARCHIVE PIECES — </span>
        <span>FREE WORLDWIDE SHIPPING ON ORDERS OVER $200 — </span>
        <span>NEW SUMMER DROP IS LIVE — </span>
        <span>UP TO 40% OFF SELECT ARCHIVE PIECES — </span>
      </div>
    </div>
  );
};

export default AnnouncementStrip;
