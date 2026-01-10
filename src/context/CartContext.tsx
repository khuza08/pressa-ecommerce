// src/context/CartContext.tsx
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { cartService, Cart } from '@/services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart;
  addToCart: (product: any, quantity?: number, size?: string, color?: string, variantId?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
  clearCartFromServer: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>(cartService.getCart());
  const { getToken } = useAuth();

  // For real-time updates when localStorage changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      setCart(cartService.getCart());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Load cart from backend when user logs in
  useEffect(() => {
    const token = getToken();
    if (token) {
      cartService.loadCartFromBackend().then(loadedCart => {
        setCart(loadedCart);
      });
    } else {
      // When user logs out, clear cart
      setCart({ items: [], total: 0 });
    }
  }, [getToken]);

  const addToCart = async (product: any, quantity: number = 1, size?: string, color?: string, variantId?: number) => {
    const updatedCart = await cartService.addToCart(product, quantity, size, color, variantId);
    setCart(updatedCart);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const updatedCart = await cartService.updateQuantity(itemId, quantity);
    setCart(updatedCart);
  };

  const removeItem = async (itemId: string) => {
    const updatedCart = await cartService.removeFromCart(itemId);
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

  const clearCartFromServer = async () => {
    await cartService.clearCartFromServer();
    setCart({ items: [], total: 0 });
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
        clearCartFromServer,
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