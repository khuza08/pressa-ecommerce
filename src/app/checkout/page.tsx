'use client';

import { useState, useEffect } from 'react';
import { FiArrowLeft, FiX, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { resolveImageUrl } from '@/lib/imageUrl';

export default function CheckoutPage() {
  const { cart, updateQuantity, removeItem, getTotalPrice } = useCart();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping Info, 2: Payment Method, 3: Order Review
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Indonesia',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card'); // credit_card, bank_transfer, cod
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

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
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmitOrder = async () => {
    // In a real application, this would send the order to the backend
    console.log('Submitting order:', {
      shippingInfo,
      paymentMethod,
      cart,
      total: getTotalPrice(),
    });
    
    // Simulate API call
    alert('Order submitted successfully!');
    // In a real app, you would redirect to a success page
  };

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
          <Link href="/shop/cart" className="flex items-center text-black/60 hover:text-black">
            <FiArrowLeft className="mr-2" />
            Back to Cart
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-8 px-4">Checkout</h1>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8 px-4">
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
            <span className="text-sm">Payment</span>
          </div>
          
          <div className="flex-1 h-0.5 bg-black/20 mx-2"></div>
          
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-black' : 'text-black/40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-black text-white' : 'bg-black/10'}`}>
              3
            </div>
            <span className="text-sm">Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
          {/* Order summary - always visible */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-lg border border-black/20 sticky top-4">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center py-2 border-b border-black/10">
                    <div className="w-16 h-16 bg-black/10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                      {item.image ? (
                        <img
                          src={resolveImageUrl(item.image)}
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
                      {item.color && <p className="text-black/50 text-xs">Color: {item.color}</p>}
                      
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
                  <span>Tax</span>
                  <span>Rp{(getTotalPrice() * 0.1).toLocaleString('id-ID')}</span>
                </div>
                
                <div className="border-t border-black/30 pt-3 mt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rp{(getTotalPrice() * 1.1).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout steps */}
          <div className="lg:col-span-2">
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
                      onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
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
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
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
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
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
                      onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
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
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
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
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
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
                      onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
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
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="bg-white border border-black/20 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                
                <div className="space-y-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'credit_card' ? 'border-black bg-black/5' : 'border-black/20'}`}
                    onClick={() => setPaymentMethod('credit_card')}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === 'credit_card' ? 'border-black' : 'border-black/30'}`}>
                        {paymentMethod === 'credit_card' && <div className="w-3 h-3 rounded-full bg-black"></div>}
                      </div>
                      <span className="font-medium">Credit Card</span>
                    </div>
                    
                    {paymentMethod === 'credit_card' && (
                      <div className="mt-4 pl-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">Card Number</label>
                            <input
                              type="text"
                              id="cardNumber"
                              className="w-full px-4 py-2 border border-black/20 rounded-lg"
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="cardName" className="block text-sm font-medium mb-1">Name on Card</label>
                            <input
                              type="text"
                              id="cardName"
                              className="w-full px-4 py-2 border border-black/20 rounded-lg"
                              placeholder="John Doe"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">Expiry Date</label>
                            <input
                              type="text"
                              id="expiryDate"
                              className="w-full px-4 py-2 border border-black/20 rounded-lg"
                              placeholder="MM/YY"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium mb-1">CVV</label>
                            <input
                              type="text"
                              id="cvv"
                              className="w-full px-4 py-2 border border-black/20 rounded-lg"
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'bank_transfer' ? 'border-black bg-black/5' : 'border-black/20'}`}
                    onClick={() => setPaymentMethod('bank_transfer')}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === 'bank_transfer' ? 'border-black' : 'border-black/30'}`}>
                        {paymentMethod === 'bank_transfer' && <div className="w-3 h-3 rounded-full bg-black"></div>}
                      </div>
                      <span className="font-medium">Bank Transfer</span>
                    </div>
                    
                    {paymentMethod === 'bank_transfer' && (
                      <div className="mt-4 pl-8">
                        <p className="text-sm text-black/70">Complete your payment by transferring to:</p>
                        <div className="mt-2 bg-black/5 p-4 rounded-lg">
                          <p className="font-mono">BCA: 1234567890</p>
                          <p className="font-mono">a.n. PT. Ecommerce Indonesia</p>
                        </div>
                        <p className="text-xs text-black/60 mt-2">After transferring, please complete your order and keep your transfer receipt for verification.</p>
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'cod' ? 'border-black bg-black/5' : 'border-black/20'}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === 'cod' ? 'border-black' : 'border-black/30'}`}>
                        {paymentMethod === 'cod' && <div className="w-3 h-3 rounded-full bg-black"></div>}
                      </div>
                      <span className="font-medium">Cash on Delivery (COD)</span>
                    </div>
                    
                    {paymentMethod === 'cod' && (
                      <div className="mt-4 pl-8">
                        <p className="text-sm text-black/70">Pay in cash when your order is delivered.</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevStep}
                    className="border border-black/30 py-3 px-6 rounded-full hover:bg-black/10 transition"
                  >
                    Back to Shipping
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="bg-black text-white py-3 px-6 rounded-full hover:bg-black/90 transition"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}
            
            {step === 3 && (
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
                    <p>
                      {paymentMethod === 'credit_card' && 'Credit Card'}
                      {paymentMethod === 'bank_transfer' && 'Bank Transfer'}
                      {paymentMethod === 'cod' && 'Cash on Delivery (COD)'}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevStep}
                    className="border border-black/30 py-3 px-6 rounded-full hover:bg-black/10 transition"
                  >
                    Back to Payment
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    className="bg-black text-white py-3 px-6 rounded-full hover:bg-black/90 transition"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}