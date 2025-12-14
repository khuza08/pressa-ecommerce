'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { productService, type Product } from '@/services/productService';

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  // Improved fuzzy search algorithm with better precision
  const fuzzyMatch = (text: string, query: string, threshold: number = 0.9): boolean => {
    if (!text || !query) return false;

    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();

    // Exact substring match (highest priority)
    if (textLower.includes(queryLower)) {
      return true;
    }

    // Plural/singular variation check (for cases like "shoe" vs "shoes")
    if (checkPluralSingularVariation(textLower, queryLower)) {
      return true;
    }

    // Token-based matching for multi-word queries
    const textTokens = textLower.split(/\s+/);
    const queryTokens = queryLower.split(/\s+/);

    // Each query token must have a good match in text tokens
    for (const queryToken of queryTokens) {
      let hasGoodMatch = false;

      for (const textToken of textTokens) {
        // High similarity check
        if (calculateSimilarity(queryToken, textToken) >= threshold) {
          hasGoodMatch = true;
          break;
        }
        // Plural/singular check
        if (checkPluralSingularVariation(queryToken, textToken)) {
          hasGoodMatch = true;
          break;
        }
      }

      if (!hasGoodMatch) {
        return false; // Every query token must have a match
      }
    }

    return true;
  };

  // Calculate similarity between two strings using a simple algorithm
  const calculateSimilarity = (str1: string, str2: string): number => {
    // Calculate Levenshtein Distance normalized similarity
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    // Simple character inclusion check for substring similarity
    if (longer.includes(shorter) || shorter.includes(longer)) {
      // If one string is contained in another, return higher similarity
      return Math.max(0.8, shorter.length / longer.length);
    }

    // Check for partial matches
    const commonChars = new Set([...str1].filter(char => str2.includes(char)));
    const maxPossibleCommon = Math.min(str1.length, str2.length);

    if (maxPossibleCommon === 0) return 0;

    const baseSimilarity = commonChars.size / maxPossibleCommon;

    // Boost similarity if the characters appear in sequence
    let sequenceMatches = 0;
    let minLength = Math.min(str1.length, str2.length);

    for (let i = 0; i < minLength; i++) {
      if (str1[i] === str2[i]) sequenceMatches++;
    }

    const sequenceBonus = sequenceMatches / minLength * 0.1; // Small bonus for positional similarity

    return baseSimilarity + sequenceBonus;
  };

  // Helper function to check plural/singular variations
  const checkPluralSingularVariation = (str1: string, str2: string): boolean => {
    // Remove common plural endings and compare
    const removeCommonPlurals = (word: string): string => {
      if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
      if (word.endsWith('es') && !['cases', 'bases', 'focus', 'shoes', 'glasses'].includes(word)) return word.slice(0, -2);
      if (word.endsWith('s') && !['gas', 'class', 'mass', 'glass', 'grass', 'pass', 'boss', 'meat', 'head', 'food'].includes(word)) return word.slice(0, -1);
      return word;
    };

    const baseStr1 = removeCommonPlurals(str1);
    const baseStr2 = removeCommonPlurals(str2);

    return baseStr1 === baseStr2 || str1 === baseStr2 || baseStr1 === str2;
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allProducts = await productService.getAllProducts();
      const filteredResults = allProducts.filter(product =>
        fuzzyMatch(product.name, query) ||
        fuzzyMatch(product.description || '', query) ||
        fuzzyMatch(product.category || '', query)
      );
      setSearchResults(filteredResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto py-8">
      {/* Results */}
      <div>
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600">Searching products...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && searchResults.length === 0 && initialQuery && (
          <div className="text-center justify-center items-center flex flex-col min-h-screen">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-600">Try searching for something else</p>
          </div>
        )}

        {!loading && searchResults.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{initialQuery}"
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/products/${product.id}`}
                  className="bg-white rounded-lg overflow-hidden border border-black/20 hover:border-black/40 transition-colors"
                >
                  <div className="bg-black/10 h-48 md:h-56 lg:h-64 flex items-center justify-center">
                    <img
                      src={product.image.includes('uploads')
                        ? (() => {
                            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
                            let normalizedPath = product.image.replace(/\\/g, '/');
                            if (!normalizedPath.startsWith('/')) normalizedPath = '/' + normalizedPath;
                            if (!normalizedPath.startsWith('/uploads')) normalizedPath = '/uploads/' + normalizedPath.split('uploads/')[1];
                            return `${baseUrl}${normalizedPath}`;
                          })()
                        : product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-1 md:mb-2 truncate">{product.name}</h3>
                    <p className="text-xl md:text-2xl font-bold mb-1 md:mb-2">${product.price}</p>
                    <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-black/60 mb-0.5 md:mb-1">
                      <span className="flex items-center">
                        <span className="text-yellow-500">★</span> {product.rating}
                      </span>
                      <span>|</span>
                      <span className="truncate">{product.totalSold} sold</span>
                    </div>
                    <p className="text-xs md:text-sm text-black/50 truncate">{product.store}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}