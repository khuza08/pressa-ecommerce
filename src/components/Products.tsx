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
    <div className="flex gap-3 p-3 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white min-w-[280px]">
      <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
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
  const ScrollableSection = ({ title, products, sectionKey }: any) => (
    <div className="flex-1 min-w-0">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide pb-2">
          <div className="flex flex-col gap-3">
            {products.slice(0, 6).map((product: any, idx: number) => (
              <SmallProductCard key={idx} product={product} />
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-1 mt-3">
          <span className="w-2 h-2 rounded-full bg-gray-900"></span>
          <span className="w-2 h-2 rounded-full bg-gray-300"></span>
          <span className="w-2 h-2 rounded-full bg-gray-300"></span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newProducts.map((product, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="bg-gray-900 h-64 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-2xl font-bold mb-2">${product.price}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <span className="flex items-center">
                    <span className="text-yellow-500">★</span> {product.rating}
                  </span>
                  <span>|</span>
                  <span>{product.totalSold} total sold here</span>
                </div>
                <p className="text-sm text-gray-500">{product.store}</p>
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
      `}</style>
    </div>
  );
}