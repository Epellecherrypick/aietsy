import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import styles from './ProductCard.module.css';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Could not add to cart. Please try again.');
    }
  };

  return (
    <div className={styles.card}>
      <Link to={`/product/${product._id}`} className={styles.imageWrapper}>
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/250x250?text=No+Image'}
          alt={product.title}
          className={styles.image}
        />
        {product.inventory === 0 && <div className={styles.outOfStock}>Out of Stock</div>}
      </Link>

      <div className={styles.content}>
        <Link to={`/product/${product._id}`} className={styles.title}>
          {product.title}
        </Link>

        <p className={styles.description}>
          {product.description?.substring(0, 60)}...
        </p>

        <div className={styles.meta}>
          <span className={styles.rating}>
            ⭐ {product.rating || 'New'}
          </span>
          <Link to={`/seller/${product.sellerId?._id}`} className={styles.seller}>
            {product.sellerId?.username}
          </Link>
        </div>

        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className={styles.addBtn}
            disabled={product.inventory === 0}
          >
            🛒 Add
          </button>
        </div>
      </div>
    </div>
  );
}
