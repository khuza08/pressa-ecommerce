// src/lib/constants.ts

export const APP_CONSTANTS = {
  SITE_NAME: 'PRESSA',
  DEFAULT_LOCALE: 'en-US',
  SUPPORTED_LOCALES: ['en', 'id'],
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  DEFAULT_PAGINATION_LIMIT: 20,
  CART_STORAGE_KEY: 'cart',
  THEME_STORAGE_KEY: 'theme',
};

export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCTS: '/shop/products',
  CART: '/shop/cart',
  CHECKOUT: '/checkout',
  PROFILE: '/profile',
  ABOUT: '/about',
  CONTACT: '/contact',
};

export const PRODUCT_CATEGORIES = [
  { id: 'fashion', name: 'Fashion' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'home', name: 'Home & Living' },
  { id: 'sports', name: 'Sports' },
  { id: 'books', name: 'Books' },
  { id: 'toys', name: 'Toys' },
];

export default APP_CONSTANTS;