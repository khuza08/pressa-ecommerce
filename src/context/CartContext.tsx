// src/context/CartContext.tsx
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { cartService, Cart } from '@/services/cartService';

interface CartContextType {
  cart: Cart;
  addToCart: (product: any, quantity?: number, size?: string, color?: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>(cartService.getCart());

  // For real-time updates when localStorage changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      setCart(cartService.getCart());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = (product: any, quantity: number = 1, size?: string, color?: string) => {
    const updatedCart = cartService.addToCart(product, quantity, size, color);
    setCart(updatedCart);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    const updatedCart = cartService.updateQuantity(itemId, quantity);
    setCart(updatedCart);
  };

  const removeItem = (itemId: string) => {
    const updatedCart = cartService.removeFromCart(itemId);
    setCart(updatedCart);
  };

  const getTotalItems = () => {
    return cartService.getTotalItems();
  };

  const getTotalPrice = () => {
    return cartService.getTotalPrice();
  };

  const clearCart = () => {
    const updatedCart = cartService.clearCart();
    setCart(updatedCart);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeItem,
        getTotalItems,
        getTotalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};