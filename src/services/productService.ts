import { apiService } from './apiService';

export interface ProductVariant {
  id: number;
  product_id: number;
  size: string;
  stock: number;
  sku?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  images?: Array<{
    url: string;
    alt: string;
  }>;
  rating: number;
  totalSold: string;
  store: string;
  description?: string;
  category?: string;
  has_variants: boolean;
  variants?: ProductVariant[];
  stock: number;
  condition?: string;
  minOrder: number;
  features?: string[];
  createdAt: string;
  updatedAt: string;
}

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const data = await apiService.get('/products');

      // Handle both simple array format and paginated format for backward compatibility
      if (Array.isArray(data)) {
        return data;
      } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
        // If it's the paginated format, return the data array
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return an empty array instead of throwing to prevent breaking the UI
      return [];
    }
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    try {
      return await apiService.get(`/products/${id}`);
    } catch (error) {
      console.error('Error fetching product:', error);
      return undefined;
    }
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      const allProducts = await productService.getAllProducts();
      return allProducts.filter(product =>
        product.category?.toLowerCase().includes(category.toLowerCase())
      );
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },
};