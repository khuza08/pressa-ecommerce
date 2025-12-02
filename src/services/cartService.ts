// src/services/cartService.ts
import { Product } from './productService';

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export const cartService = {
  getCart: (): Cart => {
    if (typeof window !== 'undefined') {
      const cartData = localStorage.getItem('cart');
      return cartData ? JSON.parse(cartData) : { items: [], total: 0 };
    }
    return { items: [], total: 0 };
  },

  addToCart: (product: Product, quantity: number = 1, size?: string, color?: string): Cart => {
    const cart = cartService.getCart();
    const existingItemIndex = cart.items.findIndex(item =>
      item.productId === product.id && item.size === size && item.color === color
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${size || ''}-${color || ''}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        size,
        color
      };
      cart.items.push(newItem);
    }

    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    return cart;
  },

  updateQuantity: (itemId: string, quantity: number): Cart => {
    const cart = cartService.getCart();

    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    return cart;
  },

  removeFromCart: (itemId: string): Cart => {
    const cart = cartService.getCart();
    cart.items = cart.items.filter(item => item.id !== itemId);
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    return cart;
  },

  clearCart: (): Cart => {
    const emptyCart = { items: [], total: 0 };
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(emptyCart));
    }
    return emptyCart;
  },

  getTotalItems: (): number => {
    const cart = cartService.getCart();
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice: (): number => {
    const cart = cartService.getCart();
    return cart.total;
  }
};