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
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: mainImage,
        quantity,
        size: activeVariant,
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
        <div className="p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">Detail Pesanan</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 flex gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded shrink-0">
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
        {product?.variants && product?.variants.length > 0 && (
          <div className="px-4 pb-4">
            <h4 className="font-medium mb-2">Pilih Varian:</h4>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {product.variants.map((variant: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveVariant(variant.id)}
                  className={`py-2 px-3 rounded border text-sm ${
                    activeVariant === variant.id
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selection */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Jumlah:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => updateQuantity("decrement")}
                className="px-3 py-2 text-gray-600 disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <FiMinus size={16} />
              </button>
              <span className="w-12 text-center py-2">{quantity}</span>
              <button
                onClick={() => updateQuantity("increment")}
                className="px-3 py-2 text-gray-600 disabled:opacity-50"
                disabled={quantity >= (product?.stock || 999)}
              >
                <FiPlus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="px-4 py-4 ">
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
            className="w-full bg-gray-200 text-black py-3 rounded-xl font-bold"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}