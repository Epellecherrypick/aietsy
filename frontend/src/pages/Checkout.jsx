import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import styles from './Checkout.module.css';
import toast from 'react-hot-toast';

const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '2348012345678').replace(/\D/g, '');

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    navigate('/login');
    return null;
  }

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const orderData = {
        shippingAddress: formData,
      };

      const response = await API.post('/orders', orderData);
      const order = response.data;

      await clearCart();
      toast.success('Order placed successfully!');

      const orderRef = order._id.slice(-6);
      const totalFormatted = order.totalPrice.toFixed(2);
      const message = `Hi, I'd like to complete payment for order #${orderRef}. Total: $${totalFormatted}`;
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      // Short delay so the user can see the success toast before redirecting
      setTimeout(() => {
        window.location.href = waUrl;
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place order';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Checkout</h1>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.wrapper}>
        {/* Order Summary */}
        <div className={styles.summary}>
          <h2>Order Summary</h2>

          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.productId?._id} className={styles.item}>
                <img
                  src={item.productId?.images?.[0] || 'https://via.placeholder.com/80'}
                  alt={item.productId?.title}
                />
                <div className={styles.itemInfo}>
                  <p className={styles.itemTitle}>{item.productId?.title}</p>
                  <p className={styles.itemPrice}>
                    ${item.productId?.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <p className={styles.itemTotal}>
                  ${(item.productId?.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className={styles.total}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Shipping Address</h2>

          <div className={styles.formGroup}>
            <label htmlFor="street">Street Address *</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="zip">ZIP Code *</label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="country">Country *</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
