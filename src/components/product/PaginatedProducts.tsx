'use client';

import { useState } from 'react';
import { usePaginatedProducts } from '@/hooks/useSWRProducts';
import ProductCard from '../product/ProductCard';
import Pagination from '../ui/Pagination';
import { Product } from '@/services/productService';

interface PaginatedProductsProps {
  limit?: number;
  category?: string;
  store?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
}

const PaginatedProducts = ({
  limit = 12,
  category,
  store,
  minPrice,
  maxPrice,
  sortBy = 'created_at',
  sortOrder = 'desc'
}: PaginatedProductsProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filters = {
    category,
    store,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder
  };

  const {
    products,
    total,
    pages,
    isLoading,
    isError
  } = usePaginatedProducts(currentPage, limit, filters);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top when changing pages
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <p>Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 w-full">
        <p className="text-red-500">Error loading products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-500">
        Showing {Math.min((currentPage - 1) * limit + 1, total)} - {Math.min(currentPage * limit, total)} of {total} products
      </div>
    </div>
  );
};

export default PaginatedProducts;