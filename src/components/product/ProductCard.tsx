'use client';

import { memo } from 'react';
import { FiStar, FiHeart } from 'react-icons/fi';
import Link from 'next/link';
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
    
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
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
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
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