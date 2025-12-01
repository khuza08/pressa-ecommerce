'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/productService';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  // Add other properties as needed
};

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus the input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Perform search when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call with debounce
        const allProducts = await productService.getAllProducts();
        const filteredResults = allProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredResults.slice(0, 10)); // Limit to 10 results
      } catch (err) {
        setError('Failed to search products');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Close modal and navigate to search results page
      onClose();
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white w-full h-full">
      {/* Header with search input */}
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <form onSubmit={handleSearch} className="flex items-center relative">
          <button type="submit" className="absolute left-3 text-gray-500" aria-label="Submit search">
            <FiSearch />
          </button>
          <input
            ref={inputRef}
            type="search"
            placeholder="What do you want to search?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            className="ml-3 text-gray-500"
            aria-label="Close search"
          >
            <FiX className="text-xl" />
          </button>
        </form>
      </div>

      {/* Search results */}
      <div className="p-4 max-h-[calc(100vh-70px)] overflow-y-auto">
        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && searchResults.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found for "{searchQuery}"</p>
          </div>
        )}

        {!loading && !error && searchResults.length === 0 && !searchQuery && (
          <div className="text-center py-8">
            <p className="text-gray-500">Enter a search term</p>
          </div>
        )}

        {!loading && !error && searchResults.length > 0 && (
          <div className="space-y-3">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => {
                  router.push(`/shop/products/${product.id}`);
                  onClose();
                }}
              >
                <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{product.name}</h3>
                  <p className="text-sm font-bold text-gray-900">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}