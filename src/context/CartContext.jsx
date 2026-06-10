import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const CART_KEY = 'lucifur_cart';

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [previousUser, setPreviousUser] = useState(user);

  useEffect(() => {
    if (previousUser && !user) {
      clearCart();
    }
    setPreviousUser(user);
  }, [user, previousUser]);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setCartItems(JSON.parse(stored));
    } catch (_) {}
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item._id === product._id && item.selectedSize === size
      );
      if (existing) {
        const newQty = existing.quantity + quantity;
        return prev.map((item) =>
          item._id === product._id && item.selectedSize === size
            ? { ...item, quantity: Math.min(newQty, 10) }
            : item
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image || '',
          category: product.category,
          selectedSize: size,
          quantity: Math.min(quantity, 10),
        },
      ];
    });
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item._id === productId && item.selectedSize === size))
    );
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity < 1) return removeFromCart(productId, size);
    if (quantity > 10) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
