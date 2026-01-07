'use client';

import { memo } from 'react';
import { FiStar, FiHeart } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { useFavorites } from '@/context/FavoriteContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  totalSold: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(({ product }: ProductCardProps) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Create the proper image URL for favorites
    let imageUrl = product.image;
    if (product.image && !product.image.startsWith('http')) {
      // If not a full URL, check if it's a file that needs the uploads path
      if (product.image.includes('uploads/')) {
        // Extract filename from uploads path
        const filename = product.image.split('uploads/').pop();

        // Get the base URL and remove any /api/v1 suffix for static files
        let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        if (baseUrl.endsWith('/api/v1')) {
          baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
        }

        imageUrl = `${baseUrl}/uploads/${filename}`;
      } else if (!product.image.startsWith('/')) {
        // It's a simple filename, so prepend the uploads path
        // Get the base URL and remove any /api/v1 suffix for static files
        let baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
        if (baseUrl.endsWith('/api/v1')) {
          baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'));
        }

        imageUrl = `${baseUrl}/uploads/${product.image}`;
      }
    }

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        price: product.price,
        image: imageUrl
      });
    }
  };

  // Format price with proper currency formatting
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <Link
      href={`/shop/products/${product.id}`}
      className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <div className="relative">
        <div className="aspect-square w-full overflow-hidden rounded-md">
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
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={false}
            />
          )}
        </div>
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          aria-label={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
        >
          <FiHeart
            className={isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-black/40'}
          />
        </button>
      </div>
      
      <div className="mt-3">
        <h3 className="font-medium text-sm line-clamp-2 h-12 overflow-hidden">{product.name}</h3>
        
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            <FiStar className="text-yellow-400 fill-current" />
            <span className="ml-1 text-sm">{product.rating}</span>
          </div>
          <span className="text-black/50 text-sm">|</span>
          <span className="text-black/50 text-sm">Terjual {product.totalSold}</span>
        </div>
        
        <div className="mt-2">
          <span className="font-bold text-sm">{formattedPrice}</span>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;