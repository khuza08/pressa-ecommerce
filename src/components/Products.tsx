'use client';

import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Products() {
  // Data untuk small cards di bagian atas
  const smallCardData = [
    {
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
      name: 'Classic Watch',
      rating: 4.4,
      totalSold: '1.2k',
      store: 'Time Store'
    },
    {
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop',
      name: 'Sunglasses',
      rating: 4.4,
      totalSold: '890',
      store: 'Fashion Hub'
    },
    {
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      name: 'Headphones',
      rating: 4.4,
      totalSold: '2.1k',
      store: 'Audio Shop'
    },
    {
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      name: 'Sneakers',
      rating: 4.4,
      totalSold: '3.5k',
      store: 'Shoe Palace'
    },
    {
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
      name: 'Backpack',
      rating: 4.4,
      totalSold: '1.8k',
      store: 'Bag Store'
    },
    {
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop',
      name: 'Laptop',
      rating: 4.4,
      totalSold: '956',
      store: 'Tech World'
    },
    {
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop',
      name: 'Camera',
      rating: 4.4,
      totalSold: '1.3k',
      store: 'Photo Pro'
    },
    {
      image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200&h=200&fit=crop',
      name: 'Perfume',
      rating: 4.4,
      totalSold: '2.4k',
      store: 'Fragrance Shop'
    },
    {
      image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=200&h=200&fit=crop',
      name: 'Desk Lamp',
      rating: 4.4,
      totalSold: '780',
      store: 'Home Decor'
    },
    {
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&h=200&fit=crop',
      name: 'Smart Speaker',
      rating: 4.4,
      totalSold: '1.9k',
      store: 'Tech Hub'
    },
    {
      image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=200&h=200&fit=crop',
      name: 'Fitness Tracker',
      rating: 4.4,
      totalSold: '3.1k',
      store: 'Sport Tech'
    },
    {
      image: 'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?w=200&h=200&fit=crop',
      name: 'Wireless Mouse',
      rating: 4.4,
      totalSold: '1.5k',
      store: 'PC Store'
    }
  ];

  // Data untuk produk besar di bawah
  const newProducts = [
    {
      image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop',
      name: 'Leather Jacket',
      price: 150,
      rating: 4.4,
      totalSold: '2.3k',
      store: 'Fashion Store'
    },
    {
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
      name: 'Designer Bag',
      price: 150,
      rating: 4.4,
      totalSold: '1.9k',
      store: 'Luxury Bags'
    },
    {
      image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop',
      name: 'Smart Watch',
      price: 150,
      rating: 4.4,
      totalSold: '3.2k',
      store: 'Tech Store'
    },
    {
      image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop',
      name: 'Running Shoes',
      price: 150,
      rating: 4.4,
      totalSold: '4.1k',
      store: 'Sport Shop'
    },
    {
      image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&h=400&fit=crop',
      name: 'Sunglasses Pro',
      price: 150,
      rating: 4.4,
      totalSold: '1.5k',
      store: 'Eyewear Co'
    },
    {
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop',
      name: 'Gaming Headset',
      price: 150,
      rating: 4.4,
      totalSold: '2.7k',
      store: 'Gaming Hub'
    }
  ];

  const [scrollPositions, setScrollPositions] = useState({
    newArrivals: 0,
    topRated: 0,
    trendings: 0
  });

  // Component untuk small product card
  const SmallProductCard = ({ product }: any) => (
    <div className="flex gap-3 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white min-w-[280px]">
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
    </div>
  );

  // Component untuk section dengan scroll horizontal
  const ScrollableSection = ({ title, products, sectionKey }: any) => {
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
            <div className="flex gap-4 px-4">
              {/* Bagi produk per page */}
              {Array.from({ length: totalPages }).map((_, pageIdx) => (
                <div key={pageIdx} className="shrink-0 w-full snap-start">
                  <div className="flex flex-col gap-3">
                    {products
                      .slice(pageIdx * itemsPerPage, (pageIdx + 1) * itemsPerPage)
                      .map((product: any, idx: number) => (
                        <SmallProductCard key={idx} product={product} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-1 mt-3">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <span 
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentPage ? 'bg-gray-900' : 'bg-gray-300'
                }`}
              ></span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full md:w-[80vw] mx-auto py-8 px-4">
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
        <h2 className="text-2xl font-bold mb-6 px-4">NEW PRODUCTS</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6 px-4">
          {newProducts.map((product, idx) => (
            <div 
              key={idx} 
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
            </div>
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