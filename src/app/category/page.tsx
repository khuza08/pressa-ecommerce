'use client';

import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { productService, type Product } from '@/services/productService';

export default function CategoryPage() {
  const [categoryResults, setCategoryResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  useEffect(() => {
    if (initialCategory) {
      performCategoryFilter(initialCategory);
    }
  }, [initialCategory]);

  const performCategoryFilter = async (category: string) => {
    if (!category.trim()) {
      setCategoryResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all products and filter by category
      const allProducts = await productService.getAllProducts();
      const filteredResults = allProducts.filter(product =>
        product.category && 
        product.category.toLowerCase().includes(category.toLowerCase())
      );
      setCategoryResults(filteredResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter products by category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto py-8">
      {/* Results */}
      <div>
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && categoryResults.length === 0 && initialCategory && (
          <div className="text-center justify-center items-center flex flex-col min-h-screen">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found in "{initialCategory}" category</h2>
            <p className="text-gray-600">Try browsing other categories</p>
          </div>
        )}

        {!loading && categoryResults.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {categoryResults.length} product{categoryResults.length !== 1 ? 's' : ''} in "{initialCategory}" category
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {categoryResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/products/${product.id}`}
                  className="bg-white rounded-lg overflow-hidden border-2 border-black/20 hover:border-black/40 transition-colors"
                >
                  <div className="bg-[#242424]/10 h-48 md:h-56 lg:h-64 flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image.includes('uploads')
                          ? (() => {
                              // Get the base URL and remove any /api/v1 suffix for static files
                              let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                              if (baseUrl.endsWith('/api/v1')) {
                                baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
                              }

                              let normalizedPath = product.image.replace(/\\/g, '/');
                              if (!normalizedPath.startsWith('/')) normalizedPath = '/' + normalizedPath;
                              if (!normalizedPath.startsWith('/uploads')) normalizedPath = '/uploads/' + normalizedPath.split('uploads/')[1];
                              return `${baseUrl}${normalizedPath}`;
                            })()
                          : product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-1 md:mb-2 truncate">{product.name}</h3>
                    <p className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Rp{product.price.toLocaleString('id-ID')}</p>
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