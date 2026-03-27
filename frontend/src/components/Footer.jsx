import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h4>About AiEtsy</h4>
          <p>Your marketplace for handmade, vintage, and unique items.</p>
        </div>

        <div className={styles.section}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Browse Products</a></li>
            <li><a href="/seller-signup">Sell on AiEtsy</a></li>
            <li><a href="/">Contact</a></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h4>Support</h4>
          <ul>
            <li><a href="/">Help Center</a></li>
            <li><a href="/">Terms of Service</a></li>
            <li><a href="/">Privacy Policy</a></li>
            <li><a href="/">Returns</a></li>
          </ul>
        </div>

        <div className={styles.section}>
          <h4>Follow Us</h4>
          <div className={styles.social}>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">📷</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {currentYear} AiEtsy. All rights reserved.</p>
      </div>
    </footer>
  );
}
