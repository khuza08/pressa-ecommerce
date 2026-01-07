'use client';

import { useEffect, useRef } from 'react';
import { FiHeart, FiX } from 'react-icons/fi';
import { useFavorites } from '@/context/FavoriteContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FavoriteDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  visible: boolean;
}

export default function FavoriteDropdown({ isOpen, onClose, visible }: FavoriteDropdownProps) {
  const { favorites, removeFromFavorites, getFavoritesCount } = useFavorites();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!visible && !isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full right-0 mt-2 w-80 bg-white shadow-xl rounded-lg border border-black/20 z-50 transition-all duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <div className="p-4 border-b border-black/20 flex justify-between items-center">
        <h3 className="font-bold text-lg">Favorites</h3>
        <button
          onClick={onClose}
          className="text-black/50 hover:text-black"
          aria-label="Close favorites"
        >
          <FiX size={20} />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {getFavoritesCount() === 0 ? (
          <div className="p-6 text-center text-black/50">
            <FiHeart size={48} className="mx-auto text-black/30 mb-3" />
            <p>Your favorites list is empty</p>
            <Link
              href="/products"
              className="mt-3 inline-block text-blue-600 hover:underline text-sm"
              onClick={onClose}
            >
              Browse products
            </Link>
          </div>
        ) : (
          <ul>
            {favorites.map((item) => (
              <li
                key={item.id}
                className="p-4 border-b border-black/10 flex items-center gap-3 hover:bg-black/5"
              >
                <div className="w-16 h-16 bg-black/20 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={
                      // Handle different URL formats
                      item.image.startsWith('http')
                        ? item.image  // Already a full URL
                        : item.image.includes('uploads/')
                          ? (() => {
                              // Extract just the filename from the uploads path
                              let filename = item.image;
                              if (item.image.includes('uploads/')) {
                                filename = item.image.split('uploads/').pop() || item.image;
                              }
                              // Use a relative URL that will be proxied to the backend
                              return `/uploads/${filename}`;
                            })() // Handle uploads path
                          : `/uploads/${item.image}` // Simple filename
                    }
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-black/60 text-sm">${item.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => removeFromFavorites(item.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Remove from favorites"
                >
                  <FiX size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {getFavoritesCount() > 0 && (
        <div className="p-4 border-t border-black/20">
          <div className="flex gap-2">
            <Link
              href="/favorites"
              className="flex-1 bg-black text-white py-2 px-4 rounded-full text-center hover:bg-black/90 transition"
              onClick={onClose}
            >
              View Favorites
            </Link>
            <button
              className="flex-1 bg-black/90 text-white py-2 px-4 rounded-full hover:bg-black/80 transition"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}