import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import styles from './Home.module.css';
import { CATEGORIES } from '../constants/categories';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await API.get('/products?limit=8');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to AiEtsy</h1>
          <p>Discover unique, handcrafted, and vintage items from talented sellers</p>
          <Link to="/products" className={styles.ctaButton}>
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <div className={styles.container}>
          <h2>Shop by Category</h2>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map(({ value, label, icon }) => (
              <Link
                key={value}
                to={`/products?category=${encodeURIComponent(value)}`}
                className={styles.categoryCard}
              >
                <div className={styles.categoryIcon}>{icon}</div>
                <p>{label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.featured}>
        <div className={styles.container}>
          <h2>Featured Products</h2>
          {loading ? (
            <div className={styles.loading}>Loading products...</div>
          ) : (
            <div className={styles.grid}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          <div className={styles.viewAll}>
            <Link to="/products" className={styles.viewAllBtn}>
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose AiEtsy */}
      <section className={styles.whyChoose}>
        <div className={styles.container}>
          <h2>Why Choose AiEtsy?</h2>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>✨</div>
              <h3>Unique Items</h3>
              <p>Find one-of-a-kind products you won't see anywhere else</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🤝</div>
              <h3>Support Artists</h3>
              <p>Direct support for independent sellers and creators</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📦</div>
              <h3>Fast Shipping</h3>
              <p>Quick and reliable delivery to your doorstep</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💙</div>
              <h3>Buyer Protection</h3>
              <p>Safe and secure payments with buyer protection</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
