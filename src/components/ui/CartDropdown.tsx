'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiX } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { resolveImageUrl } from '@/lib/imageUrl';

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  visible: boolean;
}

export default function CartDropdown({ isOpen, onClose, visible }: CartDropdownProps) {
  const { cart, getTotalPrice } = useCart();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      className={`absolute top-full right-0 mt-2 w-80 bg-white rounded-lg border-2 border-black/10 z-50 transition-all duration-300 ${isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
    >
      <div className="p-4 border-b-2 border-black/10 flex justify-between items-center">
        <h3 className="font-bold text-lg">Your Cart</h3>
        <button
          onClick={onClose}
          className="text-black/50 hover:text-black p-1 rounded-full hover:bg-[#242424]/10"
          aria-label="Close cart"
        >
          <FiX size={20} />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {cart.items.length === 0 ? (
          <div className="p-6 text-center text-black/50">
            <FiShoppingCart size={48} className="mx-auto text-black/30 mb-3" />
            <p>Your cart is empty</p>
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
            {cart.items.map((item) => (
              <li
                key={item.id}
                className="p-4 border-b-2 border-black/10 flex items-center gap-3 hover:bg-[#242424]/5"
              >
                <div className="w-16 h-16 bg-[#242424]/20 rounded-md overflow-hidden shrink-0">
                  {(() => {
                    const imgSrc = resolveImageUrl(item.image);
                    return imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    );
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-black/60 text-sm">Rp{item.price.toLocaleString('id-ID')} x {item.quantity}</p>
                  {item.size && <p className="text-black/50 text-xs">Size: {item.size}</p>}
                  {item.color && <p className="text-black/50 text-xs">Color: {item.color}</p>}
                </div>
                <div className="text-right">
                  <p className="font-medium">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {cart.items.length > 0 && (
        <div className="p-4 border-t-2 border-black/10">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Total:</span>
            <span className="font-bold">Rp{getTotalPrice().toLocaleString('id-ID')}</span>
          </div>
          <div className="flex gap-2">
            <Link
              href="/shop/cart"
              className="flex-1 bg-[#242424] text-white py-2 px-4 rounded-full text-center hover:bg-[#242424]/90 transition"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                // Use setTimeout to allow dropdown to close before navigation
                setTimeout(() => {
                  router.push('/shop/cart');
                }, 0); // Use 0 timeout to schedule after current event loop
              }}
            >
              View Cart
            </Link>
            <button className="flex-1 bg-[#242424]/90 text-white py-2 px-4 rounded-full hover:bg-[#242424]/80 transition">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}