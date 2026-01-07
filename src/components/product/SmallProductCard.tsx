'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiStar } from 'react-icons/fi';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  totalSold: number;
  store: string;
}

interface SmallProductCardProps {
  product: Product;
}

const SmallProductCard = memo(({ product }: SmallProductCardProps) => {
  return (
    <Link href={`/shop/products/${product.id}`} className="flex gap-4 p-4 border border-black/20 rounded-xl hover:border-black/40 transition-colors bg-white min-w-[280px]">
      <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center shrink-0 relative">
        {product.image.includes('uploads') ? (
          <img
            src={(() => {
              // Extract just the filename from the uploads path
              let filename = product.image;
              if (product.image.includes('uploads/')) {
                filename = product.image.split('uploads/').pop() || product.image;
              }

              // Get the base URL and remove any /api/v1 suffix for static files
              let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
              if (baseUrl.endsWith('/api/v1')) {
                baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
              }

              return `${baseUrl}/uploads/${filename}`;
            })()}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="w-full h-full object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={false}
          />
        )}
      </div>
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{product.name}</h4>
        <div className="flex items-center gap-1 text-xs text-black/60 mt-0.5">
          <span className="flex items-center">
            <FiStar className="text-yellow-400 fill-current" />
            <span>{product.rating}</span>
          </span>
          <span>|</span>
          <span>{product.totalSold} total sold here</span>
        </div>
        <p className="text-xs text-black/50 mt-0.5 truncate">{product.store}</p>
      </div>
    </Link>
  );
});

SmallProductCard.displayName = 'SmallProductCard';

export default SmallProductCard;