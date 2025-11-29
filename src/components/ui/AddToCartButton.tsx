'use client';

import { FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/types/cart';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  size?: string;
  color?: string;
}

export default function AddToCartButton({ product, size, color }: AddToCartButtonProps) {
  const { addItem, cart } = useCart();
  
  const isInCart = cart.items.some(item => 
    item.productId === product.id && 
    item.size === size && 
    item.color === color
  );
  
  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `${product.id}-${size || 'default'}-${color || 'default'}`, // Unique ID for different variants
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      size,
      color
    };
    
    addItem(cartItem);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isInCart}
      className={`flex items-center justify-center w-full py-3 px-4 rounded-full font-medium ${
        isInCart 
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
          : 'bg-black text-white hover:bg-gray-800'
      } transition`}
    >
      {isInCart ? 'Added to Cart' : 'Add to Cart'}
    </button>
  );
}