import { FiShoppingCart, FiMessageSquare, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface ProductDetailBottomBarProps {
  product: any;
  mainImage: string;
  quantity: number;
  activeVariant: string;
}

export default function ProductDetailBottomBar({
  product,
  mainImage,
  quantity,
  activeVariant
}: ProductDetailBottomBarProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: mainImage,
        quantity,
        size: activeVariant,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: mainImage,
        quantity,
        size: activeVariant,
      }, quantity, activeVariant);
      router.push('/shop/cart');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex">
      <button
        onClick={() => router.push('/')}
        className="flex-1 py-3 px-4 bg-white border-r border-gray-200 flex flex-col items-center justify-center"
      >
        <FiMessageSquare className="text-xl mb-1" />
        <span className="text-xs">Chat</span>
      </button>
      <button
        onClick={handleAddToCart}
        className="flex-1 py-3 px-4 bg-yellow-400 text-black flex flex-col items-center justify-center"
      >
        <FiShoppingCart className="text-xl mb-1" />
        <span className="text-xs">Tambahkan</span>
      </button>
      <button
        onClick={handleBuyNow}
        className="flex-1 py-3 px-4 bg-red-500 text-white flex flex-col items-center justify-center"
      >
        <FiShoppingBag className="text-xl mb-1" />
        <span className="text-xs">Beli</span>
      </button>
    </div>
  );
}