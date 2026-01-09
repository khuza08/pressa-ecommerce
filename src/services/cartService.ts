// src/services/cartService.ts
import { Product } from './productService';
import { apiService } from './apiService';

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
    console.log('Current token in syncCartWithBackend:', token);
    console.log('Is authenticated?', !!token);

    try {
      // Get current cart from localStorage
      const localCart = cartService.getCart();
      console.log('Local cart:', localCart);

      // If user is authenticated, sync with backend
      if (token) {
        console.log('Making API call to sync cart with backend');
        // Get current cart from backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/cart`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Sync cart API response:', response.status);
        if (response.ok) {
          const backendData = await response.json();
          console.log('Backend cart data:', backendData);
          const backendItems: BackendCartItem[] = backendData.items || [];

          // Merge local cart with backend cart
          const mergedItems = [...localCart.items];

          backendItems.forEach(backendItem => {
            const existingIndex = mergedItems.findIndex(item =>
              item.productId === backendItem.product_id &&
              item.size === backendItem.size &&
              item.color === backendItem.color
            );

            if (existingIndex >= 0) {
              // Update quantity if backend has more items
              if (mergedItems[existingIndex].quantity < backendItem.quantity) {
                mergedItems[existingIndex].quantity = backendItem.quantity;
              }
            } else {
              // Add item from backend to local cart
              mergedItems.push({
                id: `${backendItem.product_id}-${backendItem.size || ''}-${backendItem.color || ''}-${Date.now()}`,
                productId: backendItem.product_id,
                name: backendItem.product.name,
                price: backendItem.product.price,
                image: backendItem.product.image,
                quantity: backendItem.quantity,
                size: backendItem.size,
                color: backendItem.color,
              });
            }
          });

          // Update local cart
          const updatedCart: Cart = {
            items: mergedItems,
            total: mergedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          };

          cartService.setCart(updatedCart);
          console.log('Cart synced with backend and updated locally:', updatedCart);
        } else {
          console.error('Failed to sync cart with backend:', response.statusText);
        }
      } else {
        console.log('No token found, skipping cart sync with backend');
      }
    } catch (error) {
      console.error('Error syncing cart with backend:', error);
    }
  },

  // Load cart from backend when user logs in
  loadCartFromBackend: async (): Promise<Cart> => {
    console.log('loadCartFromBackend called');
    const token = localStorage.getItem('auth_token');
    console.log('Current token in loadCartFromBackend:', token);
    console.log('Is authenticated?', !!token);

    try {
      if (token) {
        console.log('Making API call to load cart from backend');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/cart`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Load cart API response:', response.status);
        if (response.ok) {
          const backendData = await response.json();
          console.log('Loaded cart data from backend:', backendData);
          const backendItems: BackendCartItem[] = backendData.items || [];

          // Convert backend items to local cart format
          const localItems = backendItems.map(backendItem => ({
            id: `${backendItem.product_id}-${backendItem.size || ''}-${backendItem.color || ''}-${backendItem.variant_id || 'no_variant'}-${Date.now()}`,
            productId: backendItem.product_id,
            name: backendItem.product.name,
            price: backendItem.product.price,
            image: backendItem.product.image,
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

          // Save to localStorage
          cartService.setCart(cart);
          console.log('Cart loaded from backend and saved to localStorage:', cart);
          return cart;
        } else {
          console.error('Failed to load cart from backend:', response.statusText);
        }
      } else {
        console.log('No token found, skipping cart load from backend');
      }
    } catch (error) {
      console.error('Error loading cart from backend:', error);
    }

    // Return empty cart if failed to load from backend
    console.log('Returning empty cart');
    return { items: [], total: 0 };
  },

  // Clear cart in backend when user logs out
  clearCartOnLogout: async (): Promise<void> => {
    console.log('clearCartOnLogout called');
    const token = localStorage.getItem('auth_token');
    console.log('Current token in clearCartOnLogout:', token);
    console.log('Is authenticated?', !!token);

    try {
      if (token) {
        console.log('Making API call to clear cart on backend');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/cart`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Clear cart API response:', response.status);
        if (!response.ok) {
          console.error('Error clearing cart on logout:', response.statusText);
        } else {
          console.log('Successfully cleared cart on backend');
        }
      } else {
        console.log('No token found, skipping backend cart clear');
      }
    } catch (error) {
      console.error('Error clearing cart on logout:', error);
    }

    // Clear local storage
    cartService.clearCart();
  },

  addToCart: async (product: Product, quantity: number = 1, size?: string, color?: string, variantId?: number): Promise<Cart> => {
    console.log('addToCart called with product:', product);
    const token = localStorage.getItem('auth_token');
    console.log('Current token in addToCart:', token);
    console.log('Is authenticated?', !!token);

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
        image: product.image,
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

    // If user is authenticated, sync with backend
    if (token) {
      console.log('Making API call to add to cart');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/cart`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity,
            size,
            color,
            variant_id: variantId
          }),
        });

        console.log('Cart API response:', response.status);
        if (!response.ok) {
          console.error('Error adding to cart on backend:', await response.text());
        } else {
          console.log('Successfully added to cart on backend');
        }
      } catch (error) {
        console.error('Error adding to cart on backend:', error);
      }
    } else {
      console.log('No token found, skipping backend sync for cart');
    }

    return cart;
  },

  updateQuantity: async (itemId: string, quantity: number): Promise<Cart> => {
    console.log('updateQuantity called with itemId:', itemId, 'quantity:', quantity);
    const token = localStorage.getItem('auth_token');
    console.log('Current token in updateQuantity:', token);
    console.log('Is authenticated?', !!token);

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

    // If user is authenticated, sync with backend
    if (token && cart.items[itemIndex]) {
      console.log('Making API call to update cart quantity');
      try {
        const item = cart.items[itemIndex];
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/cart/${item.productId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quantity,
          }),
        });

        console.log('Update cart API response:', response.status);
        if (!response.ok) {
          console.error('Error updating cart on backend:', await response.text());
        } else {
          console.log('Successfully updated cart on backend');
        }
      } catch (error) {
        console.error('Error updating cart on backend:', error);
      }
    } else {
      console.log('No token found or item not found, skipping backend sync for updateQuantity');
    }

    return cart;
  },

  removeFromCart: async (itemId: string): Promise<Cart> => {
    console.log('removeFromCart called with itemId:', itemId);
    const token = localStorage.getItem('auth_token');
    console.log('Current token in removeFromCart:', token);
    console.log('Is authenticated?', !!token);

    const cart = cartService.getCart();
    const itemIndex = cart.items.findIndex(item => item.id === itemId);

    if (itemIndex >= 0) {
      const item = cart.items[itemIndex];
      cart.items = cart.items.filter(item => item.id !== itemId);
      cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(cart));
      }

      // If user is authenticated, sync with backend
      if (token) {
        console.log('Making API call to remove from cart');
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'}/cart/${item.productId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          console.log('Remove from cart API response:', response.status);
          if (!response.ok) {
            console.error('Error removing from cart on backend:', await response.text());
          } else {
            console.log('Successfully removed from cart on backend');
          }
        } catch (error) {
          console.error('Error removing from cart on backend:', error);
        }
      } else {
        console.log('No token found, skipping backend sync for removeFromCart');
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