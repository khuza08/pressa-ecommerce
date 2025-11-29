// Products.tsx
'use client';

import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import { productService, type Product } from '@/services/productService';

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
      <div className="w-full md:w-[80vw] mx-auto py-8 px-4 flex justify-center items-center">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full md:w-[80vw] mx-auto py-8 px-4">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Component untuk small product card
  const SmallProductCard = ({ product }: { product: Product }) => (
    <Link href={`/shop/products/${product.id}`} className="flex gap-3 p-4 border border-black/20 rounded-xl hover:border-black/40 transition-colors bg-white min-w-[280px]">
      <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{product.name}</h4>
        <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
          <span>★ {product.rating}</span>
          <span>|</span>
          <span>{product.totalSold} total sold here</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{product.store}</p>
      </div>
    </Link>
  );

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
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
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
                      .map((product, idx) => (
                        <SmallProductCard key={idx} product={product} />
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
  const smallCardData = products.slice(0, 12); // First 12 products
  const newProducts = products.slice(0, 6); // First 6 products for new products section

  return (
    <div className="w-[80vw] mx-auto py-8">
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
        <h2 className="text-2xl font-bold mb-6">NEW PRODUCTS</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6">
          {newProducts.map((product, idx) => (
            <Link
              key={idx}
              href={`/shop/products/${product.id}`}
              className="bg-white rounded-2xl overflow-hidden border border-black/20 hover:border-black/40 transition-colors"
            >
              <div className="bg-gray-900 h-48 md:h-56 lg:h-64 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 md:p-4 lg:p-5">
                <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-1 md:mb-2 truncate">{product.name}</h3>
                <p className="text-xl md:text-2xl font-bold mb-1 md:mb-2">${product.price}</p>
                <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-600 mb-0.5 md:mb-1">
                  <span className="flex items-center">
                    <span className="text-yellow-500">★</span> {product.rating}
                  </span>
                  <span>|</span>
                  <span className="truncate">{product.totalSold} sold</span>
                </div>
                <p className="text-xs md:text-sm text-gray-500 truncate">{product.store}</p>
              </div>
            </Link>
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