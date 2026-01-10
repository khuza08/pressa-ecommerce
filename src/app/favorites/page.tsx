'use client';

import { useState, useEffect } from 'react';
import { FiX, FiHeart, FiArrowLeft, FiCheck, FiShoppingCart, FiLoader } from 'react-icons/fi';
import { useFavorites } from '@/context/FavoriteContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { resolveImageUrl } from '@/lib/imageUrl';
import { productService, Product } from '@/services/productService';

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === favorites.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(favorites.map(item => item.id));
    }
  };

  const handleCheckoutSelected = async () => {
    if (selectedIds.length === 0) return;
    setIsCheckingOut(true);

    try {
      const selectedFavorites = favorites.filter(item => selectedIds.includes(item.id));

      // We need to fetch full product details to handle variants/defaults
      for (const fav of selectedFavorites) {
        const fullProduct = await productService.getProductById(fav.id);
        if (fullProduct) {
          // If product has variants, we pick the first one by default for simplicity in favorites-to-checkout
          const variantId = fullProduct.variants?.[0]?.id;
          const size = fullProduct.variants?.[0]?.size;
          await addToCart(fullProduct, 1, size, undefined, variantId);
        }
      }

      // After adding all to cart, redirect to checkout
      router.push('/checkout');
    } catch (error) {
      console.error('Error during favorites checkout:', error);
      alert('Failed to move items to checkout. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

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
          <div className="text-center py-12 px-4 text-black">
            <div className="mx-auto w-24 h-24 bg-[#242424]/10 rounded-full flex items-center justify-center mb-4">
              <FiHeart className="text-black/40 text-3xl" />
            </div>
            <h3 className="text-lg font-medium mb-2">Your favorites list is empty</h3>
            <p className="text-black/60 mb-6">Looks like you haven't added anything to your favorites yet</p>
            <Link
              href="/"
              className="inline-block bg-[#242424] text-white py-3 px-6 rounded-full hover:bg-[#242424]/90 transition text-black"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 text-black">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between py-4 border-b-2 border-black/10 mb-2">
                <div className="flex items-center">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center text-sm font-medium hover:text-black/70 transition"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 border-black/10 mr-3 flex items-center justify-center ${selectedIds.length === favorites.length ? 'bg-[#242424]' : 'bg-transparent'}`}>
                      {selectedIds.length === favorites.length && <FiCheck className="text-white text-xs" />}
                    </div>
                    Select All ({favorites.length})
                  </button>
                </div>
                {selectedIds.length > 0 && (
                  <span className="text-sm font-medium">
                    {selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected
                  </span>
                )}
              </div>

              <ul>
                {favorites.map((item) => (
                  <li
                    key={item.id}
                    className={`py-6 border-b-2 border-black/10 flex flex-col sm:flex-row transition-colors ${selectedIds.includes(item.id) ? 'bg-[#242424]/[0.02]' : ''}`}
                  >
                    <div className="flex items-center mr-4 mb-4 sm:mb-0">
                      <button
                        onClick={() => handleToggleSelect(item.id)}
                        className={`w-6 h-6 rounded-full border-2 border-black/10 flex items-center justify-center transition-colors ${selectedIds.includes(item.id) ? 'bg-[#242424]' : 'bg-transparent hover:bg-[#242424]/5'}`}
                      >
                        {selectedIds.includes(item.id) && <FiCheck className="text-white text-sm" />}
                      </button>
                    </div>

                    <div className="w-24 h-24 bg-[#242424]/10 rounded-md overflow-hidden mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                      {item.image ? (
                        <img
                          src={resolveImageUrl(item.image) || undefined}
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
                          className="text-black/40 hover:text-black/60 transition"
                          aria-label="Remove from favorites"
                        >
                          <FiX size={20} />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center space-x-4">
                        <button
                          onClick={async () => {
                            const fullProduct = await productService.getProductById(item.id);
                            if (fullProduct) {
                              const variantId = fullProduct.variants?.[0]?.id;
                              const size = fullProduct.variants?.[0]?.size;
                              await addToCart(fullProduct, 1, size, undefined, variantId);
                              router.push('/checkout');
                            }
                          }}
                          className="text-sm bg-[#242424] text-white px-4 py-2 rounded-full hover:bg-[#242424]/80 transition flex items-center"
                        >
                          <FiShoppingCart className="mr-2" size={14} />
                          Check Out
                        </button>
                        <Link
                          href={`/products/${item.id}`}
                          className="text-sm text-black/60 hover:text-black"
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
              <div className="p-6 rounded-4xl border-2 border-black/10 sticky top-24">
                <h2 className="text-lg font-bold mb-4">Summary</h2>
                <div className="space-y-3 pb-4 border-b-2 border-black/10 mb-4">
                  <div className="flex justify-between">
                    <span className="text-black/60">Total Favorites</span>
                    <span className="font-medium">{favorites.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60">Selected Items</span>
                    <span className="font-medium">{selectedIds.length}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutSelected}
                  disabled={selectedIds.length === 0 || isCheckingOut}
                  className="w-full bg-[#242424] text-white py-3 px-4 rounded-full hover:bg-[#242424]/80 transition disabled:cursor-not-allowed flex items-center justify-center font-bold"
                >
                  {isCheckingOut ? (
                    <FiLoader className="animate-spin mr-2" />
                  ) : (
                    <FiShoppingCart className="mr-2" />
                  )}
                  Checkout Selected
                </button>


                <Link href="/" className="w-full mt-4 border-2 border-black/10 py-3 px-4 rounded-full text-black text-center bg-white hover:bg-[#242424]/5 transition block text-sm">
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