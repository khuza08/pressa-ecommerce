import { Product } from './productService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export class SWRProductService {
  // Method to be used with SWR fetcher
  static async getAllProducts(): Promise<Product[]> {
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
      return [];
    }
  }

  static async getProductById(id: string): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Product not found: ${id}`);
        }
        throw new Error(`Failed to fetch product: ${response.status}`);
      }
      const product = await response.json();
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products?category=${encodeURIComponent(category)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products by category: ${response.status}`);
      }
      const products = await response.json();
      return Array.isArray(products) ? products : [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  // Method for pagination
  static async getProductsPaginated(page: number, limit: number, category?: string): Promise<{ 
    data: Product[], 
    total: number, 
    pages: number 
  }> {
    try {
      let url = `${API_BASE_URL}/products?page=${page}&limit=${limit}`;
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch paginated products: ${response.status}`);
      }
      
      const result = await response.json();
      return {
        data: Array.isArray(result.data) ? result.data : [],
        total: result.total || 0,
        pages: result.pages || 1
      };
    } catch (error) {
      console.error('Error fetching paginated products:', error);
      return { data: [], total: 0, pages: 1 };
    }
  }
}