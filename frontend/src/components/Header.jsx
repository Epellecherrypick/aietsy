import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const cartCount = cart?.items?.length || 0;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          🛍️ AiEtsy
        </Link>

        <form onSubmit={handleSearch} className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn}>
            Search
          </button>
        </form>

        <nav className={styles.nav}>
          <Link to="/products" className={styles.navLink}>
            Browse
          </Link>
          {user ? (
            <div className={styles.userMenu}>
              <Link to="/profile" className={styles.navLink}>
                👤 {user.username}
              </Link>
              {user.isSeller && (
                <Link to="/seller" className={styles.navLink}>
                  Sell
                </Link>
              )}
              {!user.isSeller && (
                <Link to="/seller-signup" className={styles.navLink}>
                  Become Seller
                </Link>
              )}
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login" className={styles.navLink}>
                Login
              </Link>
              <Link to="/register" className={styles.navLink}>
                Register
              </Link>
            </div>
          )}
          <Link to="/cart" className={styles.cartLink}>
            🛒 Cart
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
