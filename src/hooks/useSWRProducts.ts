import useSWR from 'swr';
import { Product } from '@/services/productService';
import { CarouselItem } from '@/services/carouselService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

// Fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  }).then(data => {
    // Handle both simple array format and paginated format for backward compatibility
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
      // If it's the paginated format, return the data array
      return data.data;
    } else {
      return [];
    }
  });

// Custom hook for getting all products with caching
export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    `${API_BASE_URL}/products`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      errorRetryCount: 3,
      fallbackData: [] // Provide empty array as fallback
    }
  );

  return {
    products: data || [],
    isLoading,
    isError: error,
    mutate // Allows manual refresh
  };
}

// Custom hook for getting paginated products
export function usePaginatedProducts(page: number, limit: number, filters?: {
  category?: string;
  store?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
}) {
  // Build query string for pagination and filters
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  if (filters?.category) params.append('category', filters.category);
  if (filters?.store) params.append('store', filters.store);
  if (filters?.minPrice !== undefined) params.append('min_price', filters.minPrice.toString());
  if (filters?.maxPrice !== undefined) params.append('max_price', filters.maxPrice.toString());
  if (filters?.sortBy) params.append('sort_by', filters.sortBy);
  if (filters?.sortOrder) params.append('sort_order', filters.sortOrder);

  const url = `${API_BASE_URL}/products?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<{
    data: Product[];
    total: number;
    pages: number;
    current: number;
    limit: number;
  }>(url, fetcher, {
    errorRetryCount: 3,
    fallbackData: { data: [], total: 0, pages: 1, current: 1, limit: 10 }
  });

  return {
    products: data?.data || [],
    total: data?.total || 0,
    pages: data?.pages || 1,
    current: data?.current || 1,
    limit: data?.limit || 10,
    isLoading,
    isError: error,
    mutate
  };
}

// Custom hook for getting carousel items with caching
export function useCarouselItems() {
  const { data, error, isLoading, mutate } = useSWR<CarouselItem[]>(
    `${API_BASE_URL}/carousels`,
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch carousel items: ${response.status}`);
      }
      const result = await response.json();
      // Ensure result is an array
      return Array.isArray(result) ? result : [];
    },
    {
      refreshInterval: 60000, // Refresh every minute
      errorRetryCount: 3,
      fallbackData: [] // Provide empty array as fallback
    }
  );

  return {
    carouselItems: data || [],
    isLoading,
    isError: error,
    mutate // Allows manual refresh
  };
}

// Custom hook for getting a specific product with caching
export function useProduct(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Product>(
    id ? `${API_BASE_URL}/products/${id}` : null,
    fetcher,
    {
      errorRetryCount: 3,
      shouldRetryOnError: false // Don't retry if product doesn't exist (404)
    }
  );

  return {
    product: data,
    isLoading,
    isError: error,
    mutate
  };
}

// Custom hook for getting products by category with caching
export function useProductsByCategory(category: string) {
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    category ? `${API_BASE_URL}/products?category=${encodeURIComponent(category)}` : null,
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching products by category: ${response.status}`);
      }
      const products = await response.json();
      return Array.isArray(products) ? products : [];
    },
    {
      errorRetryCount: 3,
      fallbackData: []
    }
  );

  return {
    products: data || [],
    isLoading,
    isError: error,
    mutate
  };
}