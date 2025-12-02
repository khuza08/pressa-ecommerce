// Products.tsx
'use client';

import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import { productService, type Product } from '@/services/productService';
import ProductCard from './ProductCard';
import SmallProductCard from './SmallProductCard';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await productService.getAllProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const [scrollPositions, setScrollPositions] = useState({
    newArrivals: 0,
    topRated: 0,
    trendings: 0
  });

  if (loading) {
    return (
      <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto py-8 flex justify-center items-center">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Component untuk section dengan scroll horizontal
  const ScrollableSection = ({ title, products, sectionKey }: { title: string, products: Product[], sectionKey: string }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handleScroll = (e: any) => {
      const scrollLeft = e.target.scrollLeft;
      const width = e.target.offsetWidth;
      const page = Math.round(scrollLeft / width);
      setCurrentPage(page);
    };

    return (
      <div className="flex-1 min-w-0 px-4 sm:px-0">
        <h2 className="text-xl font-bold mb-4 px-2 sm:px-0">{title}</h2>
        <div className="relative">
          <div
            className="overflow-x-scroll scrollbar-hide pb-2 snap-x snap-mandatory scroll-smooth"
            onScroll={handleScroll}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex gap-4">
              {/* Bagi produk per page */}
              {Array.from({ length: totalPages }).map((_, pageIdx) => (
                <div key={pageIdx} className="shrink-0 w-full snap-start">
                  <div className="flex flex-col gap-3">
                    {products
                      .slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage)
                      .map((product) => (
                        <SmallProductCard key={product.id} product={product} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Split products into categories for the different sections
  const smallCardData = products && Array.isArray(products) ? products.slice(0, 12) : []; // First 12 products
  const newProducts = products && Array.isArray(products) ? products.slice(0, 6) : []; // First 6 products for new products section

  return (
    <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto py-8 px-4">
      {/* Top Section - Three Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <ScrollableSection
          title="NEW ARRIVALS"
          products={smallCardData}
          sectionKey="newArrivals"
        />
        <ScrollableSection
          title="TOP RATED"
          products={smallCardData}
          sectionKey="topRated"
        />
        <ScrollableSection
          title="TRENDINGS"
          products={smallCardData}
          sectionKey="trendings"
        />
      </div>

      {/* New Products Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 px-2 sm:px-0">NEW PRODUCTS</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Pastikan scrollbar benar-benar hidden di semua browser */
        .scrollbar-hide::-webkit-scrollbar {
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>
    </div>
  );
}