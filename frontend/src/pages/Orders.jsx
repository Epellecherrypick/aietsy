import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import styles from './Orders.module.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading orders...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <span className={styles.date}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className={`${styles.status} ${styles[order.status]}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div className={styles.items}>
                {order.items?.map((item, idx) => (
                  <div key={idx} className={styles.item}>
                    <span>{item.title}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.footer}>
                <div className={styles.shipping}>
                  <p className={styles.label}>Shipping to:</p>
                  <p>{order.shippingAddress?.street}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                </div>
                <div className={styles.total}>
                  <span>Total:</span>
                  <span>${order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
