import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, token, user } = useAuth();
  const [wishlist, setWishlist] = useState([]); // array of product objects
  const [previousUser, setPreviousUser] = useState(user);

  useEffect(() => {
    if (previousUser && !user) {
      setWishlist([]);
    }
    setPreviousUser(user);
  }, [user, previousUser]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const currentToken = localStorage.getItem('userToken') || token;
      const res = await fetch(`${API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (res.status === 404) {
        throw new Error('Wishlist service is currently unavailable');
      }
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error('Wishlist service is currently unavailable');
      }
      if (!res.ok) throw new Error(data.message || 'Failed to fetch wishlist');
      if (data.success) {
        setWishlist(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch wishlist');
      }
    } catch (err) {
      setError(err.message || 'Error fetching wishlist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated, token, user]);

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) return false; // caller should open login modal

    try {
      const currentToken = localStorage.getItem('userToken');
      const res = await fetch(`${API_URL}/wishlist/${product._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
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
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, error, loading, retryFetch: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
};
