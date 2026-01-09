'use client';

import { useState, useEffect } from 'react';
import { FiX, FiHeart, FiArrowLeft } from 'react-icons/fi';
import { useFavorites } from '@/context/FavoriteContext';
import Link from 'next/link';
import { resolveImageUrl } from '@/lib/imageUrl';

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to avoid hydration mismatches
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto">
          <div className="mb-6">
            <Link href="/" className="flex items-center text-black/60 hover:text-black">
              <FiArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-2xl font-bold mb-8 px-4">Your Favorites</h1>
          {/* Render the same container structure to avoid hydration mismatch */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
            <div className="lg:col-span-2">
              <div className="text-center py-12 px-4">
                <p>Loading favorites...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-black/60 hover:text-black">
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-8 px-4">Your Favorites</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="mx-auto w-24 h-24 bg-black/10 rounded-full flex items-center justify-center mb-4">
              <FiHeart className="text-black/40 text-3xl" />
            </div>
            <h3 className="text-lg font-medium mb-2">Your favorites list is empty</h3>
            <p className="text-black/60 mb-6">Looks like you haven't added anything to your favorites yet</p>
            <Link
              href="/"
              className="inline-block bg-black text-white py-3 px-6 rounded-full hover:bg-black/90 transition"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
            <div className="lg:col-span-2">
              <ul>
                {favorites.map((item) => (
                  <li
                    key={item.id}
                    className="py-6 border-b border-black/20 flex flex-col sm:flex-row"
                  >
                    <div className="w-24 h-24 bg-black/10 rounded-md overflow-hidden mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                      {item.image ? (
                        <img
                          src={resolveImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No Image</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{item.name}</h3>
                          <p className="text-black/60 mt-1">Rp{item.price?.toLocaleString('id-ID')}</p>
                        </div>

                        <button
                          onClick={() => removeFromFavorites(item.id)}
                          className="text-black/40 hover:text-black/60"
                          aria-label="Remove from favorites"
                        >
                          <FiX />
                        </button>
                      </div>

                      <div className="mt-4">
                        <Link
                          href={`/products/${item.id}`}
                          className="text-sm text-black/60 hover:text-black underline"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-black/5 p-6 rounded-lg">
                <h2 className="text-lg font-bold mb-4">Favorites Summary</h2>
                <p>You have {favorites.length} item{favorites.length !== 1 ? 's' : ''} in your favorites list.</p>
                
                <Link href="/" className="w-full mt-4 border border-black/30 py-3 px-4 rounded-full text-center hover:bg-black/10 transition block">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}