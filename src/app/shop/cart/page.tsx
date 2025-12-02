'use client';

import { FiX, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, getTotalPrice } = useCart();

  const updateItemQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-black/60 hover:text-black">
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-8 px-4">Your Cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="mx-auto w-24 h-24 bg-black/10 rounded-full flex items-center justify-center mb-4">
              <FiX className="text-black/40 text-3xl" />
            </div>
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-black/60 mb-6">Looks like you haven't added anything to your cart yet</p>
            <Link
              href="/"
              className="inline-block bg-black text-white py-3 px-6 rounded-full hover:bg-black/90 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
            <div className="lg:col-span-2">
              <ul>
                {cart.items.map((item) => (
                  <li
                    key={item.id}
                    className="py-6 border-b border-black/20 flex flex-col sm:flex-row"
                  >
                    <div className="w-24 h-24 bg-black/10 rounded-md overflow-hidden mb-4 sm:mb-0 sm:mr-6 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{item.name}</h3>
                          <p className="text-black/60 mt-1">${item.price.toFixed(2)}</p>
                          {item.size && <p className="text-black/50 text-sm mt-1">Size: {item.size}</p>}
                          {item.color && <p className="text-black/50 text-sm mt-1">Color: {item.color}</p>}
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-black/40 hover:text-black/60"
                          aria-label="Remove item"
                        >
                          <FiX />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center">
                        <div className="flex items-center border border-black/30 rounded-full">
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-black/60 hover:bg-black/10 rounded-l-full"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-3 py-1 text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-black/60 hover:bg-black/10 rounded-r-full"
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        <div className="ml-6 font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-black/5 p-6 rounded-lg">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                  </div>

                  <div className="border-t border-black/30 pt-3 mt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-black text-white py-3 px-4 rounded-full text-center block hover:bg-black/90 transition"
                >
                  Proceed to Checkout
                </Link>

                <Link href="/" className="w-full mt-3 border border-black/30 py-3 px-4 rounded-full text-center hover:bg-black/10 transition block">
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