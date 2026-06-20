import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await API.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      const response = await API.post('/cart/add', { productId, quantity });
      setCart(response.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await API.post('/cart/remove', { productId });
      setCart(response.data);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    const item = cart?.items?.find(i => i.productId?._id === productId);
    if (!item) return;

    if (quantity > item.productId.inventory) {
      toast.error(`Only ${item.productId.inventory} available in stock`);
      return;
    }

    try {
      const response = await API.put('/cart/update', { productId, quantity });
      setCart(response.data);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await API.delete('/cart/clear');
      setCart(response.data);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, removeFromCart, updateCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
