import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Load cart from localStorage on initial render
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const [toast, setToast] = useState({ message: '', visible: false });

  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2000);
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Create a unique identifier that includes color and storage
      const itemId = `${product.id}-${product.color || 'default'}-${product.storage || 'default'}`;
      
      const existingItem = prevItems.find(item => 
        item.id === product.id && 
        item.color === product.color && 
        item.storage === product.storage
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && 
          item.color === product.color && 
          item.storage === product.storage
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    showToast(`Added: ${product.name}`);
  };

  const updateCartQuantity = (product, newQuantity) => {
    setCartItems(prevItems => {
      if (newQuantity === 0) {
        return prevItems.filter(item =>
          !(item.id === product.id && item.color === product.color && item.storage === product.storage)
        );
      }
      return prevItems.map(item =>
        item.id === product.id && item.color === product.color && item.storage === product.storage
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const removeFromCart = (product) => {
    setCartItems(prevItems => prevItems.filter(item =>
      !(item.id === product.id && item.color === product.color && item.storage === product.storage)
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    toast,
    showToast
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 