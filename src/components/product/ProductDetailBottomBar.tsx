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
            variantId: product.has_variants ? activeVariant : undefined,
          });
        }
      }, 'cart');
      return;
    }

    if (product) {
      // If product has variants, validate that a variant is selected
      if (product.has_variants && !activeVariant) {
        alert('Silakan pilih ukuran terlebih dahulu');
        return;
      }

      // If product has variants, check if selected variant is in stock
      if (product.has_variants) {
        const selectedVariant = product.variants?.find((v: any) => v.id === parseInt(activeVariant));
        if (selectedVariant && selectedVariant.stock <= 0) {
          alert('Ukuran yang dipilih sedang habis');
          return;
        }
      }

      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: mainImage,
        quantity,
        variantId: product.has_variants ? activeVariant : undefined,
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black/20 z-40 flex">
        <button
          onClick={() => router.push('/')}
          className="flex-1 py-3 px-4 bg-white border-r-2 border-black/20 flex flex-col items-center justify-center"
        >
          <FiMessageSquare className="text-xl mb-1" />
          <span className="text-xs">Chat</span>
        </button>
        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 px-4 bg-[#242424]/20 text-black flex flex-col items-center justify-center"
        >
          <FiShoppingCart className="text-xl mb-1" />
          <span className="text-xs">Tambahkan</span>
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 px-4 bg-[#242424] text-white flex flex-col items-center justify-center"
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