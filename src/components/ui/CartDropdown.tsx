'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiX } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

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
      className={`absolute top-full right-0 mt-2 w-80 bg-white shadow-xl rounded-lg border border-black/20 z-50 transition-all duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <div className="p-4 border-b border-black/20 flex justify-between items-center">
        <h3 className="font-bold text-lg">Your Cart</h3>
        <button
          onClick={onClose}
          className="text-black/50 hover:text-black p-1 rounded-full hover:bg-black/10"
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
                className="p-4 border-b border-black/10 flex items-center gap-3 hover:bg-black/5"
              >
                <div className="w-16 h-16 bg-black/20 rounded-md overflow-hidden shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  <p className="text-black/60 text-sm">${item.price.toFixed(2)} x {item.quantity}</p>
                  {item.size && <p className="text-black/50 text-xs">Size: {item.size}</p>}
                  {item.color && <p className="text-black/50 text-xs">Color: {item.color}</p>}
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {cart.items.length > 0 && (
        <div className="p-4 border-t border-black/20">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Total:</span>
            <span className="font-bold">${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <Link
              href="/shop/cart"
              className="flex-1 bg-black text-white py-2 px-4 rounded-full text-center hover:bg-black/90 transition"
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
            <button className="flex-1 bg-black/90 text-white py-2 px-4 rounded-full hover:bg-black/80 transition">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}