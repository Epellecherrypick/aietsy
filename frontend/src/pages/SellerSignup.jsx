import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import styles from './SellerSignup.module.css';
import toast from 'react-hot-toast';

export default function SellerSignup() {
  const { user, token, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleBecomeSeller = async () => {
    try {
      const response = await API.post('/users/become-seller');
      toast.success('You are now a seller!');
      setUser({ ...user, isSeller: true });
      navigate('/seller');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to become a seller');
    }
  };

  if (user?.isSeller) {
    navigate('/seller');
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1>Become a Seller</h1>
        <p className={styles.subtitle}>Start selling your amazing products on AiEtsy</p>

        <div className={styles.benefits}>
          <div className={styles.benefit}>
            <span className={styles.icon}>🌍</span>
            <h3>Reach Global Customers</h3>
            <p>Sell to customers worldwide</p>
          </div>

          <div className={styles.benefit}>
            <span className={styles.icon}>💰</span>
            <h3>Competitive Fees</h3>
            <p>Affordable seller fees with no hidden costs</p>
          </div>

          <div className={styles.benefit}>
            <span className={styles.icon}>📊</span>
            <h3>Analytics & Insights</h3>
            <p>Track sales and customer metrics</p>
          </div>

          <div className={styles.benefit}>
            <span className={styles.icon}>🛡️</span>
            <h3>Seller Protection</h3>
            <p>Secure payment and dispute resolution</p>
          </div>
        </div>

        <div className={styles.terms}>
          <p>By becoming a seller, you agree to our Seller Agreement and will be responsible for:</p>
          <ul>
            <li>Providing accurate product information</li>
            <li>Maintaining quality standards</li>
            <li>Responding to customer inquiries</li>
            <li>Processing orders promptly</li>
          </ul>
        </div>

        <button onClick={handleBecomeSeller} className={styles.confirmBtn}>
          Yes, I Want to Become a Seller
        </button>

        <button onClick={() => navigate('/')} className={styles.cancelBtn}>
          Not Now
        </button>
      </div>
    </div>
  );
}
