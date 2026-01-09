import { FiX, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface PreCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  mainImage: string;
  quantity: number;
  activeVariant: string;
  setQuantity: (quantity: number) => void;
  setActiveVariant: (variant: string) => void;
}

export default function PreCheckoutModal({
  isOpen,
  onClose,
  product,
  mainImage,
  quantity,
  activeVariant,
  setQuantity,
  setActiveVariant
}: PreCheckoutModalProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  if (!isOpen) return null;

  const handleConfirmBuy = () => {
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

      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: mainImage,
        quantity,
        variantId: product.has_variants ? activeVariant : undefined,
      });
      router.push('/shop/cart');
    }
    onClose();
  };

  const updateQuantity = (type: "increment" | "decrement") => {
    if (type === "increment" && quantity < (product?.stock || 999)) {
      setQuantity(quantity + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div 
        className="w-full bg-white rounded-t-xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-black/20 flex justify-between items-center">
          <h3 className="font-bold text-lg">Detail Pesanan</h3>
          <button
            onClick={onClose}
            className="text-black/60 hover:text-black"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 flex gap-4">
          <div className="w-16 h-16 bg-black/10 rounded shrink-0">
            <img
              src={mainImage}
              alt={product?.name}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold">{product?.name}</h4>
            <p className="text-lg font-bold">Rp{product?.price?.toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* Variant Selection */}
        {product?.has_variants && product?.variants && product?.variants.length > 0 && (
          <div className="px-4 pb-4">
            <h4 className="font-medium mb-2">Pilih Ukuran:</h4>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {product.variants.map((variant: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveVariant(variant.id)}
                  disabled={variant.stock <= 0}
                  className={`py-2 px-3 rounded border text-sm ${
                    activeVariant === variant.id
                      ? 'border-black bg-black text-white'
                      : variant.stock <= 0
                          ? 'border-black/30 text-black/30 cursor-not-allowed'
                          : 'border-black/30'
                  }`}
                >
                  {variant.size}
                  {variant.stock <= 0 && <span className="text-xs ml-1">(Habis)</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selection */}
        <div className="px-4 py-4 border-t border-black/20">
          <div className="flex items-center justify-between">
            <span className="font-medium">Jumlah:</span>
            <div className="flex items-center border border-black/30 rounded-lg">
              <button
                onClick={() => updateQuantity("decrement")}
                className="px-3 py-2 text-black/60 disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <FiMinus size={16} />
              </button>
              <span className="w-12 text-center py-2">{quantity}</span>
              <button
                onClick={() => updateQuantity("increment")}
                className="px-3 py-2 text-black/60 disabled:opacity-50"
                disabled={quantity >= (product?.stock || 999)}
              >
                <FiPlus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="px-4 py-4 border-t border-black/20">
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span className="font-bold">Rp{(product?.price * quantity)?.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4">
          <button
            onClick={handleConfirmBuy}
            className="w-full bg-black text-white py-3 rounded-xl font-bold mb-2"
          >
            Beli Sekarang
          </button>
          <button
            onClick={onClose}
            className="w-full bg-black/10 text-black py-3 rounded-xl font-bold"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}