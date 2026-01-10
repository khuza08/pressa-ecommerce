'use client';

import { useState, useEffect } from 'react';
import { FiArrowLeft, FiLoader, FiTruck, FiCreditCard } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoriteContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { resolveImageUrl } from '@/lib/imageUrl';
import { paymentService, CreateTransactionRequest } from '@/services/paymentService';
import Script from 'next/script';

// Add type definition for Midtrans Snap
declare global {
  interface Window {
    snap: any;
  }
}

// Midtrans configuration
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';
const MIDTRANS_IS_PRODUCTION = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
const MIDTRANS_SNAP_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js';

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCartFromServer } = useCart();
  const { clearFavoritesFromServer } = useFavorites();
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

    // Initial check for snap
    if (typeof window !== 'undefined' && window.snap) {
      console.log('DEBUG: window.snap already available on mount');
      setSnapReady(true);
    }
  }, []);

  // Monitor snap availability more aggressively
  useEffect(() => {
    if (snapReady) return;

    const checkInterval = setInterval(() => {
      if (typeof window !== 'undefined' && window.snap) {
        console.log('DEBUG: window.snap detected via interval');
        setSnapReady(true);
        clearInterval(checkInterval);
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [snapReady]);

  useEffect(() => {
    console.log('DEBUG: snapReady state changed:', snapReady);
  }, [snapReady]);

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

  const handleInputChange = (field: keyof typeof shippingInfo, value: string) => {
    // Clear specific error when user tries to correct specific field
    const newErrors = { ...errors };
    delete newErrors[field];

    switch (field) {
      case 'fullName':
        // Only allow letters, spaces, dots
        if (/^[a-zA-Z\s\.]*$/.test(value)) {
          setShippingInfo(prev => ({ ...prev, [field]: value }));
          setErrors(newErrors);
        } else {
          // Block input and show immediate error
          setErrors({ ...errors, [field]: 'Numbers and special characters are not allowed' });
        }
        break;

      case 'phone':
        // Only allow digits, +, -, space. Limit length to 15.
        if (/^[\d\+\-\s]*$/.test(value)) {
          if (value.length <= 15) {
            setShippingInfo(prev => ({ ...prev, [field]: value }));
            setErrors(newErrors);
          }
        } else {
          setErrors({ ...errors, [field]: 'Only numbers, +, -, and spaces are allowed' });
        }
        break;

      case 'postalCode':
        // Only allow digits. Limit to 6.
        if (/^\d*$/.test(value)) {
          if (value.length <= 6) {
            setShippingInfo(prev => ({ ...prev, [field]: value }));
            setErrors(newErrors);
          }
        } else {
          setErrors({ ...errors, [field]: 'Only numbers are allowed' });
        }
        break;

      case 'city':
        // Only allow letters and spaces
        if (/^[a-zA-Z\s]*$/.test(value)) {
          setShippingInfo(prev => ({ ...prev, [field]: value }));
          setErrors(newErrors);
        } else {
          setErrors({ ...errors, [field]: 'Only alphabets are allowed' });
        }
        break;

      default:
        setShippingInfo(prev => ({ ...prev, [field]: value }));
        setErrors(newErrors);
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    const { fullName, email, phone, address, city, postalCode } = shippingInfo;

    // Full Name: Min 3 chars, letters/dots/spaces only
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Name is too short';
    } else if (!/^[a-zA-Z\s\.]+$/.test(fullName)) {
      newErrors.fullName = 'Name contains invalid characters';
    }

    // Email: Standard regex
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone: Allow +, space, dash. Check digit count (10-15 typical)
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\+\-\s]+$/.test(phone)) {
      newErrors.phone = 'Phone contains invalid characters';
    } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      newErrors.phone = 'Phone must be 10-15 digits';
    }

    // Address: Min 5 chars to ensure meaningful input
    if (!address.trim()) {
      newErrors.address = 'Address is required';
    } else if (address.trim().length < 5) {
      newErrors.address = 'Please enter a complete address';
    }

    // City: Min 3 chars
    if (!city.trim()) {
      newErrors.city = 'City is required';
    } else if (city.trim().length < 3) {
      newErrors.city = 'Invalid city name';
    }

    // Postal Code: Numeric only, 4-6 digits
    if (!postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^\d+$/.test(postalCode)) {
      newErrors.postalCode = 'Postal code must be numbers only';
    } else if (postalCode.length < 4 || postalCode.length > 6) {
      newErrors.postalCode = 'Postal code must be 4-6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      // Auto-format phone number to +62 standard
      let cleanPhone = shippingInfo.phone.replace(/\D/g, '');
      if (cleanPhone.startsWith('0')) {
        cleanPhone = '62' + cleanPhone.slice(1);
      }

      // If it doesn't start with 62 (and wasn't 0), prepend 62? 
      // User context implies typical local numbers. If they typed 812..., treat as 62812...
      if (!cleanPhone.startsWith('62')) {
        cleanPhone = '62' + cleanPhone;
      }

      // Format as +62 8XX XXXX XXXX
      // Simple regex chunking: 62 (country) + next 3-4 (prefix) + rest
      // Example: 6281234567890 -> +62 812 3456 7890
      const formattedPhone = `+${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 5)} ${cleanPhone.slice(5, 9)} ${cleanPhone.slice(9)}`;

      setShippingInfo(prev => ({ ...prev, phone: formattedPhone.trim() }));
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
          clearCartFromServer();
          clearFavoritesFromServer();
          router.push(`/payment/success?order_id=${response.midtrans_order_id}`);
        },
        onPending: (result: any) => {
          console.log('Payment pending:', result);
          clearCartFromServer();
          clearFavoritesFromServer();
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
      <Script
        src={MIDTRANS_SNAP_URL}
        data-client-key={MIDTRANS_CLIENT_KEY}
        id="midtrans-script"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Midtrans Snap.js loaded successfully');
          if (!MIDTRANS_CLIENT_KEY) {
            console.error('CRITICAL: Midtrans Client Key is missing! Snap popup will not function correctly.');
          }
          setSnapReady(true);
        }}
        onError={(e) => {
          console.error('Midtrans Snap.js failed to load', e);
        }}
      />

      <div className="min-h-screen bg-white py-4">
        <div className="w-full md:w-[90vw] lg:w-[90vw] mx-auto h-fit">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/shop/cart" className="flex items-center text-black/60  py-2 px-4 rounded-2xl border-2 border-black/20 hover:border-black/40 hover:text-black transition-colors group">
              <FiArrowLeft className="hover:font-bold transition-all" />
            </Link>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Active Step Content */}
            <div className="lg:col-span-2 flex flex-col">
              {step === 1 ? (
                <div className="bg-white border-2 border-black/10 rounded-2xl p-6 md:p-8 shadow-sm h-full flex flex-col">
                  <h2 className="text-xl font-bold mb-6">Shipping Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        value={shippingInfo.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl transition-all focus:ring-2 focus:ring-black/5 outline-none ${errors.fullName ? 'border-2 border-red-500 bg-red-50/10' : 'border-2 border-black/10 focus:border-2 border-black'}`}
                        placeholder="John Doe"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1.5">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl transition-all focus:ring-2 focus:ring-black/5 outline-none ${errors.email ? 'border-2 border-red-500 bg-red-50/10' : 'border-2 border-black/10 focus:border-2 border-black'}`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl transition-all focus:ring-2 focus:ring-black/5 outline-none ${errors.phone ? 'border-2 border-red-500 bg-red-50/10' : 'border-2 border-black/10 focus:border-2 border-black'}`}
                        placeholder="+62 812 3456 7890"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium mb-1.5">Postal Code *</label>
                      <input
                        type="text"
                        id="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl transition-all focus:ring-2 focus:ring-black/5 outline-none ${errors.postalCode ? 'border-2 border-red-500 bg-red-50/10' : 'border-2 border-black/10 focus:border-2 border-black'}`}
                        placeholder="12345"
                      />
                      {errors.postalCode && <p className="text-red-500 text-xs mt-1.5">{errors.postalCode}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium mb-1.5">Address *</label>
                      <input
                        type="text"
                        id="address"
                        value={shippingInfo.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl transition-all focus:ring-2 focus:ring-black/5 outline-none ${errors.address ? 'border-2 border-red-500 bg-red-50/10' : 'border-2 border-black/10 focus:border-2 border-black'}`}
                        placeholder="123 Main Street"
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address}</p>}
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-1.5">City *</label>
                      <input
                        type="text"
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl transition-all focus:ring-2 focus:ring-black/5 outline-none ${errors.city ? 'border-2 border-red-500 bg-red-50/10' : 'border-2 border-black/10 focus:border-2 border-black'}`}
                        placeholder="Jakarta"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1.5">{errors.city}</p>}
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-sm font-medium mb-1.5">Country</label>
                      <select
                        id="country"
                        value={shippingInfo.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-black/10 rounded-xl bg-white focus:ring-2 focus:ring-black/5 outline-none border-2 border-black/10 focus:border-2 border-black"
                      >
                        <option value="Indonesia">Indonesia</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Philippines">Philippines</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end mt-10">
                    <button
                      onClick={handleNextStep}
                      className="bg-[#242424] text-white py-4 px-10 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all font-bold shadow-lg shadow-black/10"
                    >
                      Continue to Review
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-black/10 rounded-2xl p-6 md:p-8 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
                  <h2 className="text-xl font-bold mb-8">Review Your Order</h2>

                  <div className="space-y-8">
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-black/40 mb-4">Shipping To</h3>
                      <div className="bg-[#242424]/5 rounded-2xl p-6 border-2 border-black/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                          <div>
                            <p className="text-black/40 mb-1">Recipient Name</p>
                            <p className="font-bold">{shippingInfo.fullName}</p>
                          </div>
                          <div>
                            <p className="text-black/40 mb-1">Email Address</p>
                            <p className="font-bold">{shippingInfo.email}</p>
                          </div>
                          <div>
                            <p className="text-black/40 mb-1">Phone Number</p>
                            <p className="font-bold">{shippingInfo.phone}</p>
                          </div>
                          <div>
                            <p className="text-black/40 mb-1">Full Address</p>
                            <p className="font-bold">{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.country}</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-black/40 mb-4">Payment Method</h3>
                      <div className="bg-[#242424]/5 rounded-2xl p-6 border-2 border-black/5">
                        <p className="text-sm leading-relaxed mb-4">
                          You will be redirected to <span className="font-bold underline decoration-black/20">Midtrans Secure Checkout</span> to complete your payment using:
                        </p>
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
                          {['Credit Card', 'Bank Transfer', 'GoPay', 'ShopeePay', 'QRIS'].map(m => (
                            <span key={m} className="px-3 py-1 bg-white border-2 border-black/5 rounded-full shadow-sm">{m}</span>
                          ))}
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="flex gap-4 mt-12">
                    <button
                      onClick={handlePrevStep}
                      disabled={isProcessing}
                      className="flex-1 border-2 border-black/10 py-4 px-6 rounded-full hover:bg-[#242424]/5 transition disabled:opacity-50 font-bold"
                    >
                      Back to Shipping
                    </button>
                    <button
                      onClick={handlePayNow}
                      disabled={isProcessing || !snapReady}
                      className="flex-[2] bg-[#242424] text-white py-4 px-6 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold shadow-lg shadow-black/10"
                    >
                      {isProcessing ? (
                        <>
                          <FiLoader className="animate-spin mr-3 h-5 w-5" />
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

            {/* Right Column: Bento Meta Data */}
            <div className="lg:col-span-1 flex flex-col h-full gap-6">
              {/* Box 1: Progress */}
              <div className="bg-[#242424] text-white rounded-2xl p-6 shadow-xl shadow-black/10 overflow-hidden relative">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 opacity-40">Checkout Status</h3>

                <div className="relative mt-4">
                  {/* Background Track (Capsule) */}
                  <div className="absolute top-[21px] left-[24px] right-[24px] h-1.5 bg-white/10 rounded-full" />

                  {/* Active Progress (Capsule) */}
                  <div
                    className="absolute top-[21px] left-[24px] h-1.5 bg-white rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                    style={{ width: step === 1 ? '50%' : 'calc(100% - 48px)' }}
                  />

                  {/* Step Icons & Labels */}
                  <div className="relative z-10 flex justify-between">
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${step >= 1 ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/20'}`}>
                        {step > 1 ? '✓' : <FiTruck className="text-md" />}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= 1 ? 'text-white' : 'text-white/40'}`}>Shipping</span>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${step >= 2 ? 'bg-white text-black border-white' : 'bg-[#242424] text-white/40 border-white/20'}`}>
                        <FiCreditCard className="text-md" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= 2 ? 'text-white' : 'text-white/40'}`}>Review</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Order Summary */}
              <div className="bg-white border-2 border-black/10 rounded-2xl p-6 shadow-sm flex flex-col flex-1">
                <h3 className="text-base font-bold uppercase tracking-widest mb-4 pb-4 border-b-2 border-black/5">Order Summary</h3>

                <div className="space-y-3 max-h-[40vh] lg:max-h-none overflow-y-auto pr-2 custom-scrollbar mb-4 flex-1">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-16 h-16 bg-[#242424]/5 rounded-xl overflow-hidden flex-shrink-0 border-2 border-black/5">
                        {item.image ? (
                          <img src={resolveImageUrl(item.image) || undefined} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-20">?</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-sm font-bold truncate mb-1">{item.name}</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-black/50">Qty: {item.quantity}</span>
                          <span className="font-bold text-[#242424]">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t-2 border-black/5 mt-auto">
                  <div className="flex justify-between text-[#242424]/70 text-sm font-medium">
                    <span>Subtotal</span>
                    <span>Rp{getTotalPrice().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-[#242424]/70 text-sm font-medium">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold uppercase tracking-tight text-xs">Free</span>
                  </div>
                  <div className="flex justify-between text-[#242424]/70 text-sm font-medium">
                    <span>Tax (10%)</span>
                    <span>Rp{(getTotalPrice() * 0.1).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-end pt-4 text-lg border-t-2 border-black/5">
                    <span className="font-bold tracking-tight text-[#242424]">Grand Total</span>
                    <span className="font-black text-2xl tracking-tighter text-[#242424]">Rp{Math.round(getTotalPrice() * 1.1).toLocaleString('id-ID')}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}