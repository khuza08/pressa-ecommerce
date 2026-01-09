'use client';

import { memo } from 'react';
import { FiStar, FiHeart } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { useFavorites } from '@/context/FavoriteContext';
import { useAuth } from '@/context/AuthContext';
import { useLoginModal } from '@/context/LoginModalContext';
import { resolveImageUrl } from '@/lib/imageUrl';

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

  const { isAuthenticated } = useAuth();

  const { openLoginModal } = useLoginModal();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If user is not authenticated, show login modal
    if (!isAuthenticated) {
      openLoginModal(async () => {
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

        if (isFavorite(product.id.toString())) {
          await removeFromFavorites(product.id.toString());
        } else {
          await addToFavorites({
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            image: imageUrl
          });
        }
      }, 'favorite');
      return;
    }

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

    if (isFavorite(product.id.toString())) {
      await removeFromFavorites(product.id.toString());
    } else {
      await addToFavorites({
        id: product.id.toString(),
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
      className="block bg-white p-4 rounded-lg border border-black/20 hover:border-black/40 transition-all overflow-hidden"
    >
      <div className="relative">
        <div className="aspect-square w-full overflow-hidden rounded-md">
          {(() => {
            const imgSrc = resolveImageUrl(product.image);
            return imgSrc ? (
              <img
                src={imgSrc}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">No Image</span>
              </div>
            );
          })()}
        </div>
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
          aria-label={isFavorite(product.id.toString()) ? "Remove from favorites" : "Add to favorites"}
        >
          <FiHeart
            className={isFavorite(product.id.toString()) ? 'fill-red-500 text-red-500' : 'text-black/40'}
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