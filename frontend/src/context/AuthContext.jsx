import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');

    // treat invalid placeholder strings as no token
    if (!savedToken || savedToken === 'undefined' || savedToken === 'null') {
      setLoading(false);
      return;
    }

    const validateSession = async () => {
      try {
        const { data } = await API.get('/users/profile');
        setUser(data);
        setToken(savedToken);
      } catch (error) {
        // bad/expired token - clear it so auth-only routes don't get locked
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        console.warn('Clearing invalid token from storage', error);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
