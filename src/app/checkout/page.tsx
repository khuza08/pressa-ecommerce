'use client';

import { useState, useEffect } from 'react';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { resolveImageUrl } from '@/lib/imageUrl';
import { paymentService, CreateTransactionRequest } from '@/services/paymentService';

// Midtrans configuration
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';
const MIDTRANS_IS_PRODUCTION = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
const MIDTRANS_SNAP_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js';

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, getToken } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping Info, 2: Review & Pay
  const [isProcessing, setIsProcessing] = useState(false);
  const [snapReady, setSnapReady] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Indonesia',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    console.log('DEBUG: MIDTRANS_CLIENT_KEY available:', !!MIDTRANS_CLIENT_KEY);
    console.log('DEBUG: MIDTRANS_SNAP_URL:', MIDTRANS_SNAP_URL);
  }, []);

  // Check authentication
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/auth?redirect=/checkout');
    }
  }, [mounted, isAuthenticated, router]);

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
          <h1 className="text-2xl font-bold mb-8 px-4">Checkout</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
            <div className="lg:col-span-2">
              <div className="text-center py-12 px-4">
                <p>Loading checkout...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) newErrors.email = 'Invalid email format';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handlePayNow = async () => {
    if (!snapReady || !window.snap) {
      alert('Payment system is loading. Please wait a moment and try again.');
      return;
    }

    if (cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare request data
      const requestData: CreateTransactionRequest = {
        customer_name: shippingInfo.fullName,
        customer_email: shippingInfo.email,
        customer_phone: shippingInfo.phone,
        shipping_address: shippingInfo.address,
        shipping_city: shippingInfo.city,
        shipping_postal: shippingInfo.postalCode,
        shipping_country: shippingInfo.country,
        items: cart.items.map(item => ({
          product_id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          variant_id: item.variantId,
        })),
        total_amount: Math.round(getTotalPrice() * 1.1), // Include 10% tax
      };

      // Create transaction
      const response = await paymentService.createTransaction(requestData);

      // Open Snap popup
      window.snap.pay(response.snap_token, {
        onSuccess: (result: any) => {
          console.log('Payment success:', result);
          clearCart();
          router.push(`/payment/success?order_id=${response.midtrans_order_id}`);
        },
        onPending: (result: any) => {
          console.log('Payment pending:', result);
          router.push(`/payment/success?order_id=${response.midtrans_order_id}&status=pending`);
        },
        onError: (result: any) => {
          console.error('Payment error:', result);
          router.push(`/payment/error?order_id=${response.midtrans_order_id}`);
        },
        onClose: () => {
          console.log('Payment popup closed');
          setIsProcessing(false);
        },
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Failed to process payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Load Midtrans Snap.js */}
      <Script
        src={MIDTRANS_SNAP_URL}
        data-client-key={MIDTRANS_CLIENT_KEY}
        id="midtrans-script"
        onLoad={() => {
          console.log('Midtrans Snap.js loaded successfully');
          setSnapReady(true);
        }}
        onError={(e) => {
          console.error('Midtrans Snap.js failed to load', e);
        }}
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-white py-8">
        <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto">
          <div className="mb-6">
            <Link href="/shop/cart" className="flex items-center text-black/60 hover:text-black">
              <FiArrowLeft className="mr-2" />
              Back to Cart
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-8 px-4">Checkout</h1>

          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-8 px-4 max-w-md">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-black' : 'text-black/40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-black text-white' : 'bg-black/10'}`}>
                1
              </div>
              <span className="text-sm">Shipping</span>
            </div>

            <div className="flex-1 h-0.5 bg-black/20 mx-2"></div>

            <div className={`flex flex-col items-center ${step >= 2 ? 'text-black' : 'text-black/40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-black text-white' : 'bg-black/10'}`}>
                2
              </div>
              <span className="text-sm">Review & Pay</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
            {/* Order summary - always visible */}
            <div className="lg:col-span-1 lg:order-2">
              <div className="p-6 rounded-lg border border-black/20 sticky top-4">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex items-center py-2 border-b border-black/10">
                      <div className="w-16 h-16 bg-black/10 rounded-md overflow-hidden mr-3 flex-shrink-0">
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

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.name}</h3>
                        <p className="text-black/60 text-sm">Rp{item.price.toLocaleString('id-ID')}</p>
                        {item.size && <p className="text-black/50 text-xs">Size: {item.size}</p>}

                        <div className="flex items-center mt-1">
                          <span className="text-sm">Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mt-6 pt-4 border-t border-black/20">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rp{getTotalPrice().toLocaleString('id-ID')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>Rp{(getTotalPrice() * 0.1).toLocaleString('id-ID')}</span>
                  </div>

                  <div className="border-t border-black/30 pt-3 mt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span>Rp{Math.round(getTotalPrice() * 1.1).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Midtrans badge */}
                <div className="mt-4 pt-4 border-t border-black/10">
                  <p className="text-xs text-black/50 text-center">Secured by Midtrans</p>
                  <div className="flex justify-center items-center gap-2 mt-2">
                    <img src="https://midtrans.com/assets/images/payments/visa.svg" alt="Visa" className="h-6" />
                    <img src="https://midtrans.com/assets/images/payments/mastercard.svg" alt="Mastercard" className="h-6" />
                    <img src="https://midtrans.com/assets/images/payments/gopay.svg" alt="GoPay" className="h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout steps */}
            <div className="lg:col-span-2 lg:order-1">
              {step === 1 && (
                <div className="bg-white border border-black/20 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-6">Shipping Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg ${errors.fullName ? 'border-red-500' : 'border-black/20'}`}
                        placeholder="John Doe"
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-black/20'}`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-black/20'}`}
                        placeholder="+62 812 3456 7890"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium mb-1">Postal Code *</label>
                      <input
                        type="text"
                        id="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg ${errors.postalCode ? 'border-red-500' : 'border-black/20'}`}
                        placeholder="12345"
                      />
                      {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium mb-1">Address *</label>
                      <input
                        type="text"
                        id="address"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg ${errors.address ? 'border-red-500' : 'border-black/20'}`}
                        placeholder="123 Main Street"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-1">City *</label>
                      <input
                        type="text"
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg ${errors.city ? 'border-red-500' : 'border-black/20'}`}
                        placeholder="Jakarta"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
                      <select
                        id="country"
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                        className="w-full px-4 py-2 border border-black/20 rounded-lg"
                      >
                        <option value="Indonesia">Indonesia</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Philippines">Philippines</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={handleNextStep}
                      className="bg-black text-white py-3 px-6 rounded-full hover:bg-black/90 transition"
                    >
                      Continue to Review
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white border border-black/20 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-6">Review Your Order</h2>

                  <div className="mb-8">
                    <h3 className="font-bold mb-4">Shipping Information</h3>
                    <div className="bg-black/5 p-4 rounded-lg">
                      <p><span className="font-medium">Name:</span> {shippingInfo.fullName}</p>
                      <p><span className="font-medium">Email:</span> {shippingInfo.email}</p>
                      <p><span className="font-medium">Phone:</span> {shippingInfo.phone}</p>
                      <p><span className="font-medium">Address:</span> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.country}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="font-bold mb-4">Payment Method</h3>
                    <div className="bg-black/5 p-4 rounded-lg">
                      <p className="text-black/70">
                        Pay securely with Midtrans. You will be redirected to a secure payment popup where you can choose from:
                      </p>
                      <ul className="mt-2 text-sm text-black/60 list-disc list-inside">
                        <li>Credit/Debit Card (Visa, Mastercard)</li>
                        <li>Bank Transfer (BCA, BNI, BRI, Mandiri, Permata)</li>
                        <li>E-Wallet (GoPay, ShopeePay)</li>
                        <li>QRIS</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      onClick={handlePrevStep}
                      className="border border-black/30 py-3 px-6 rounded-full hover:bg-black/10 transition"
                      disabled={isProcessing}
                    >
                      Back to Shipping
                    </button>
                    <button
                      onClick={handlePayNow}
                      disabled={isProcessing || !snapReady}
                      className="bg-black text-white py-3 px-6 rounded-full hover:bg-black/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isProcessing ? (
                        <>
                          <FiLoader className="animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        `Pay Rp${Math.round(getTotalPrice() * 1.1).toLocaleString('id-ID')}`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}