import { useState } from 'react';
import { FiShoppingCart, FiMessageSquare, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLoginModal } from '@/context/LoginModalContext';
import { useRouter } from 'next/navigation';
import PreCheckoutModal from './PreCheckoutModal';

interface ProductDetailBottomBarProps {
  product: any;
  mainImage: string;
  initialQuantity: number;
  initialVariant: string;
  onVariantChange: (variant: string) => void;
  onQuantityChange: (quantity: number) => void;
}

export default function ProductDetailBottomBar({
  product,
  mainImage,
  initialQuantity,
  initialVariant,
  onVariantChange,
  onQuantityChange
}: ProductDetailBottomBarProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useLoginModal();
  const router = useRouter();
  const [showPreCheckout, setShowPreCheckout] = useState(false);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [activeVariant, setActiveVariant] = useState(initialVariant);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      openLoginModal(async () => {
        if (product) {
          await addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: mainImage,
            quantity,
            size: activeVariant,
          });
        }
      }, 'cart');
      return;
    }

    if (product) {
      await addToCart({
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
      // Show pre-checkout modal instead of adding to cart directly
      setShowPreCheckout(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/20 z-40 flex">
        <button
          onClick={() => router.push('/')}
          className="flex-1 py-3 px-4 bg-white border-r border-black/20 flex flex-col items-center justify-center"
        >
          <FiMessageSquare className="text-xl mb-1" />
          <span className="text-xs">Chat</span>
        </button>
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 px-4 bg-black/20 text-black flex flex-col items-center justify-center"
        >
          <FiShoppingCart className="text-xl mb-1" />
          <span className="text-xs">Tambahkan</span>
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 px-4 bg-black text-white flex flex-col items-center justify-center"
        >
          <FiShoppingBag className="text-xl mb-1" />
          <span className="text-xs">Beli</span>
        </button>
      </div>

      {/* Pre-checkout Modal */}
      <PreCheckoutModal
        isOpen={showPreCheckout}
        onClose={() => {
          setShowPreCheckout(false);
        }}
        product={product}
        mainImage={mainImage}
        quantity={quantity}
        activeVariant={activeVariant}
        setQuantity={setQuantity}
        setActiveVariant={setActiveVariant}
      />
    </>
  );
}