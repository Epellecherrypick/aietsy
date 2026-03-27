import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider, CartContext } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/global.css';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Seller from './pages/Seller';
import SellerSignup from './pages/SellerSignup';

function AppContent() {
  const { token, user, loading } = useContext(AuthContext);
  const { fetchCart } = useContext(CartContext);
  const isAuthenticated = Boolean(token && user);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={isAuthenticated ? <Checkout /> : <Navigate to="/login" replace />} />
        <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="/seller" element={isAuthenticated ? <Seller /> : <Navigate to="/login" replace />} />
        <Route path="/seller-signup" element={isAuthenticated ? <SellerSignup /> : <Navigate to="/login" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
