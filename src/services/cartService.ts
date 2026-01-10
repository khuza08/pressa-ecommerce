// src/services/cartService.ts
import { Product } from './productService';
import { apiService } from './apiService';
import { resolveImageUrl } from '@/lib/imageUrl';

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  variantId?: number; // Added for product variants
  variantSize?: string; // Added for product variants
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface BackendCartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  size?: string;
  color?: string;
  variant_id?: number; // Added for product variants
  size_variant?: string; // Added for product variants
  created_at: string;
  updated_at: string;
  product: Product;
}

export const cartService = {
  getCart: (): Cart => {
    if (typeof window !== 'undefined') {
      const cartData = localStorage.getItem('cart');
      return cartData ? JSON.parse(cartData) : { items: [], total: 0 };
    }
    return { items: [], total: 0 };
  },

  setCart: (cart: Cart): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  },

  // Sync cart with backend
  syncCartWithBackend: async (): Promise<void> => {
    console.log('syncCartWithBackend called');
    const token = localStorage.getItem('auth_token');

    try {
      const localCart = cartService.getCart();
      if (token) {
        console.log('Making API call to sync cart with backend');
        const backendData = await apiService.get('/cart');
        const backendItems: BackendCartItem[] = backendData.items || [];

        const mergedItems = [...localCart.items];

        backendItems.forEach(backendItem => {
          const existingIndex = mergedItems.findIndex(item =>
            item.productId === backendItem.product_id &&
            item.size === backendItem.size &&
            item.color === backendItem.color
          );

          if (existingIndex >= 0) {
            if (mergedItems[existingIndex].quantity < backendItem.quantity) {
              mergedItems[existingIndex].quantity = backendItem.quantity;
            }
          } else {
            mergedItems.push({
              id: `${backendItem.product_id}-${backendItem.size || ''}-${backendItem.color || ''}-${Date.now()}`,
              productId: backendItem.product_id,
              name: backendItem.product.name,
              price: backendItem.product.price,
              image: resolveImageUrl(backendItem.product.image) || '',
              quantity: backendItem.quantity,
              size: backendItem.size,
              color: backendItem.color,
            });
          }
        });

        const updatedCart: Cart = {
          items: mergedItems,
          total: mergedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        };

        cartService.setCart(updatedCart);
        console.log('Cart synced with backend and updated locally:', updatedCart);
      }
    } catch (error) {
      console.error('Error syncing cart with backend:', error);
    }
  },

  // Load cart from backend when user logs in
  loadCartFromBackend: async (): Promise<Cart> => {
    console.log('loadCartFromBackend called');
    const token = localStorage.getItem('auth_token');

    try {
      if (token) {
        console.log('Making API call to load cart from backend');
        const backendData = await apiService.get('/cart');
        const backendItems: BackendCartItem[] = backendData.items || [];

        const localItems = backendItems.map(backendItem => ({
          id: `${backendItem.product_id}-${backendItem.size || ''}-${backendItem.color || ''}-${backendItem.variant_id || 'no_variant'}-${Date.now()}`,
          productId: backendItem.product_id,
          name: backendItem.product.name,
          price: backendItem.product.price,
          image: resolveImageUrl(backendItem.product.image) || '',
          quantity: backendItem.quantity,
          size: backendItem.size,
          color: backendItem.color,
          variantId: backendItem.variant_id,
          variantSize: backendItem.size_variant,
        }));

        const cart: Cart = {
          items: localItems,
          total: localItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        };

        cartService.setCart(cart);
        console.log('Cart loaded from backend and saved to localStorage:', cart);
        return cart;
      }
    } catch (error) {
      console.error('Error loading cart from backend:', error);
    }

    return { items: [], total: 0 };
  },

  // Clear cart in backend and locally
  clearCartFromServer: async (): Promise<void> => {
    console.log('clearCartFromServer called');
    const token = localStorage.getItem('auth_token');

    try {
      if (token) {
        console.log('Making API call to clear cart on backend');
        await apiService.delete('/cart');
        console.log('Successfully cleared cart on backend');
      }
    } catch (error) {
      console.error('Error clearing cart on backend:', error);
    }

    cartService.clearCart();
  },

  clearCartOnLogout: async (): Promise<void> => {
    await cartService.clearCartFromServer();
  },

  addToCart: async (product: Product, quantity: number = 1, size?: string, color?: string, variantId?: number): Promise<Cart> => {
    console.log('addToCart called with product:', product);
    const token = localStorage.getItem('auth_token');

    const cart = cartService.getCart();
    const existingItemIndex = cart.items.findIndex(item =>
      item.productId === product.id &&
      item.size === size &&
      item.color === color &&
      item.variantId === variantId
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${size || ''}-${color || ''}-${variantId || 'no_variant'}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: resolveImageUrl(product.image) || '',
        quantity,
        size,
        color,
        variantId,
        variantSize: variantId ? product.variants?.find(v => v.id === variantId)?.size : undefined
      };
      cart.items.push(newItem);
    }

    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    if (token) {
      console.log('Making API call to add to cart');
      try {
        await apiService.post('/cart', {
          product_id: product.id,
          quantity,
          size,
          color,
          variant_id: variantId
        });
        console.log('Successfully added to cart on backend');
      } catch (error) {
        console.error('Error adding to cart on backend:', error);
      }
    }

    return cart;
  },

  updateQuantity: async (itemId: string, quantity: number): Promise<Cart> => {
    console.log('updateQuantity called with itemId:', itemId, 'quantity:', quantity);
    const token = localStorage.getItem('auth_token');

    const cart = cartService.getCart();
    const itemIndex = cart.items.findIndex(item => item.id === itemId);

    if (itemIndex >= 0) {
      const item = cart.items[itemIndex];
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }

      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(cart));
      }

      if (token && quantity > 0) {
        console.log('Making API call to update cart quantity');
        try {
          const queryParams = new URLSearchParams();
          if (item.size) queryParams.append('size', item.size);
          if (item.color) queryParams.append('color', item.color);
          if (item.variantId) queryParams.append('variant_id', item.variantId.toString());

          const queryString = queryParams.toString();
          const url = `/cart/${item.productId}${queryString ? `?${queryString}` : ''}`;

          await apiService.put(url, { quantity });
          console.log('Successfully updated cart on backend');
        } catch (error) {
          console.error('Error updating cart on backend:', error);
        }
      } else if (token && quantity <= 0) {
        // Handle deletion if quantity is 0
        try {
          const queryParams = new URLSearchParams();
          if (item.size) queryParams.append('size', item.size);
          if (item.color) queryParams.append('color', item.color);
          if (item.variantId) queryParams.append('variant_id', item.variantId.toString());

          const queryString = queryParams.toString();
          const url = `/cart/${item.productId}${queryString ? `?${queryString}` : ''}`;

          await apiService.delete(url);
          console.log('Successfully removed from cart on backend (via updateQuantity)');
        } catch (error) {
          console.error('Error removing from cart on backend:', error);
        }
      }
    }

    return cart;
  },

  removeFromCart: async (itemId: string): Promise<Cart> => {
    console.log('removeFromCart called with itemId:', itemId);
    const token = localStorage.getItem('auth_token');

    const cart = cartService.getCart();
    const itemIndex = cart.items.findIndex(item => item.id === itemId);

    if (itemIndex >= 0) {
      const item = cart.items[itemIndex];
      cart.items = cart.items.filter(i => i.id !== itemId);
      cart.total = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(cart));
      }

      if (token) {
        console.log('Making API call to remove from cart');
        try {
          const queryParams = new URLSearchParams();
          if (item.size) queryParams.append('size', item.size);
          if (item.color) queryParams.append('color', item.color);
          if (item.variantId) queryParams.append('variant_id', item.variantId.toString());

          const queryString = queryParams.toString();
          const url = `/cart/${item.productId}${queryString ? `?${queryString}` : ''}`;

          await apiService.delete(url);
          console.log('Successfully removed from cart on backend');
        } catch (error) {
          console.error('Error removing from cart on backend:', error);
        }
      }
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