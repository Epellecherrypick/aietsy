import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import styles from './Cart.module.css';

export default function Cart() {
  const { cart, loading, fetchCart, removeFromCart, updateCartItem } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  if (!token) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <p>Please login to view your cart</p>
          <Link to="/login" className={styles.loginBtn}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className={styles.loading}>Loading cart...</div>;
  }

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0);

  return (
    <div className={styles.container}>
      <h1>Shopping Cart</h1>

      {items.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Your cart is empty</p>
          <Link to="/products" className={styles.shopBtn}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className={styles.cartWrapper}>
          <div className={styles.cartItems}>
            {items.map((item) => (
              <div key={item.productId?._id} className={styles.cartItem}>
                <img
                  src={item.productId?.images?.[0] || 'https://via.placeholder.com/100'}
                  alt={item.productId?.title}
                  className={styles.itemImage}
                />

                <div className={styles.itemDetails}>
                  <Link to={`/product/${item.productId?._id}`} className={styles.itemTitle}>
                    {item.productId?.title}
                  </Link>
                  <p className={styles.itemPrice}>
                    ${item.productId?.price.toFixed(2)}
                  </p>
                </div>

                <div className={styles.itemQuantity}>
                  <button
                    onClick={() =>
                      updateCartItem(item.productId?._id, item.quantity - 1)
                    }
                    className={styles.qtyBtn}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateCartItem(item.productId?._id, parseInt(e.target.value))
                    }
                    min="1"
                    max={item.productId?.inventory}
                    className={styles.qtyInput}
                  />
                  <button
                    onClick={() =>
                      updateCartItem(item.productId?._id, item.quantity + 1)
                    }
                    className={styles.qtyBtn}
                  >
                    +
                  </button>
                </div>

                <div className={styles.itemTotal}>
                  ${(item.productId?.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => removeFromCart(item.productId?._id)}
                  className={styles.removeBtn}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <h2>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className={styles.checkoutBtn}
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className={styles.continueShopping}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
