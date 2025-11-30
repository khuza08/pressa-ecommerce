'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { productService, type Product } from '@/services/productService';

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allProducts = await productService.getAllProducts();
      const filteredResults = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-[90vw] lg:w-[80vw] mx-auto py-8">
      {/* Results */}
      <div>
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600">Searching products...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && searchResults.length === 0 && initialQuery && (
          <div className="text-center justify-center items-center flex flex-col min-h-screen">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-600">Try searching for something else</p>
          </div>
        )}

        {!loading && searchResults.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{initialQuery}"
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/products/${product.id}`}
                  className="bg-white rounded-lg overflow-hidden border border-black/20 hover:border-black/40 transition-colors"
                >
                  <div className="bg-black/10 h-48 md:h-56 lg:h-64 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-1 md:mb-2 truncate">{product.name}</h3>
                    <p className="text-xl md:text-2xl font-bold mb-1 md:mb-2">${product.price}</p>
                    <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-black/60 mb-0.5 md:mb-1">
                      <span className="flex items-center">
                        <span className="text-yellow-500">★</span> {product.rating}
                      </span>
                      <span>|</span>
                      <span className="truncate">{product.totalSold} sold</span>
                    </div>
                    <p className="text-xs md:text-sm text-black/50 truncate">{product.store}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}