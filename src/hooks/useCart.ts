// src/hooks/useCart.ts
import { useState, useEffect } from 'react';
import { Cart, CartItem, cartService } from '@/services/cartService';

export const useCart = () => {
  const [cart, setCart] = useState<Cart>(cartService.getCart());

  // Update cart when localStorage changes (in case of multiple tabs)
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

  return {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    getTotalItems,
    getTotalPrice,
    clearCart,
  };
};