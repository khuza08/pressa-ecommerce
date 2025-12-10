// src/services/productService.ts
// Service to fetch products from the Go backend API

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
  variants?: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
  stock: number;
  condition?: string;
  minOrder: number;
  features?: string[];
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      const data = await response.json();

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
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return undefined;
        }
        throw new Error(`Failed to fetch product: ${response.status}`);
      }
      const product = await response.json();
      return product || undefined;
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