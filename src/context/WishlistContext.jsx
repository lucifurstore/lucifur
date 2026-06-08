import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [wishlist, setWishlist] = useState([]); // array of product objects

  // Fetch wishlist from API when user logs in
  useEffect(() => {
    if (isAuthenticated && token) {
      fetch(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setWishlist(data.data);
        })
        .catch(console.error);
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated, token]);

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) return false; // caller should open login modal

    try {
      const res = await fetch(`${API_URL}/wishlist/${product._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setWishlist(data.data); // API returns full updated wishlist
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const isWishlisted = (productId) =>
    wishlist.some((p) => p._id === productId || p === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
};
