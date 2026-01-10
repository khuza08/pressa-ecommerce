'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiLoader, FiPhone, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { paymentService } from '@/services/paymentService';
import { resolveImageUrl } from '@/lib/imageUrl';

interface OrderItem {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    size?: string;
    product?: {
        id: number;
        name: string;
        image: string;
        images?: { url: string }[];
    };
}

interface Order {
    id: number;
    order_number: string;
    midtrans_order_id?: string;
    status: string;
    total_amount: number;
    shipping_address?: string;
    shipping_city?: string;
    shipping_postal?: string;
    shipping_country?: string;
    shipping_phone?: string;
    payment_method?: string;
    payment_status: string;
    snap_token?: string;
    created_at: string;
    updated_at?: string;
    items?: OrderItem[];
}

interface Transaction {
    id: number;
    midtrans_order_id: string;
    transaction_id: string;
    payment_type: string;
    gross_amount: number;
    transaction_status: string;
    fraud_status: string;
    va_number?: string;
    bank?: string;
    payment_code?: string;
    bill_key?: string;
    biller_code?: string;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { isAuthenticated, getToken, loading: authLoading } = useAuth();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            router.push('/?login=true&redirect=/orders');
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const token = getToken();
                console.log('OrderDetailPage: Fetching order details with token:', token ? 'exists' : 'missing');

                const data = await paymentService.getPaymentStatus(resolvedParams.id);
                setOrder(data.order as Order);
                setTransaction(data.transaction as Transaction);
                setError(null);
            } catch (err: any) {
                console.error('OrderDetailPage: Fetch error:', err);
                // Check if it's an authentication error
                if (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized') || err.message.toLowerCase().includes('authenticated')) {
                    setError('Your session has expired. Please log in again.');
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [isAuthenticated, resolvedParams.id, router]);

    const getStatusStep = (status: string): number => {
        const steps: Record<string, number> = {
            pending: 0,
            processing: 1,
            shipped: 2,
            delivered: 3,
            completed: 3,
        };
        return steps[status] ?? 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <FiLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-black" />
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white py-8 flex items-center justify-center">
                <div className="max-w-md w-full px-4 text-center">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-lg mb-6">
                        <p className="mb-4">{error}</p>
                        <button
                            onClick={() => {
                                setLoading(true);
                                setError(null);
                                window.location.reload();
                            }}
                            className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition"
                        >
                            Retry
                        </button>
                    </div>
                    <Link
                        href="/orders"
                        className="inline-block bg-[#242424] text-white py-3 px-6 rounded-full hover:bg-[#242424]/90 transition"
                    >
                        View All Orders
                    </Link>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <FiPackage className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-medium text-gray-600 mb-2">Order not found</h2>
                    <p className="text-gray-400 mb-6">The order you are looking for does not exist.</p>
                    <Link
                        href="/orders"
                        className="inline-block bg-[#242424] text-white py-3 px-6 rounded-full hover:bg-[#242424]/90 transition"
                    >
                        View All Orders
                    </Link>
                </div>
            </div>
        );
    }

    const currentStep = getStatusStep(order.status);

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="w-full md:w-[90vw] lg:w-[80vw] mx-auto px-4">
                <div className="mb-6">
                    <Link href="/orders" className="flex items-center text-black/60 hover:text-black">
                        <FiArrowLeft className="mr-2" />
                        Back to Orders
                    </Link>
                </div>

                <div className="flex flex-wrap items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">{order.order_number}</h1>
                        <p className="text-gray-500">
                            Placed on {new Date(order.created_at).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                            order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-[#E5E5E5] text-black'
                            }`}>
                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </span>
                    </div>
                </div>

                {/* Order Progress */}
                <div className=" rounded-lg p-6 mb-8 border-2 border-black/10">
                    <h2 className="font-bold mb-6">Order Status</h2>
                    <div className="flex items-center justify-between w-full">
                        {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((label, index) => (
                            <div key={label} className="flex-1 flex flex-col items-center relative">
                                {index < 3 && (
                                    <div className={`absolute top-6 md:top-8 left-[50%] w-full h-1 md:h-1.5 ${index < currentStep ? 'bg-[#242424]' : 'bg-[#242424]/10'}`} />
                                )}
                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 ${index <= currentStep ? 'bg-[#242424] text-white' : 'bg-[#E5E5E5] text-black'
                                    }`}>
                                    {index === 0 && <FiCheckCircle className="text-lg md:text-2xl" />}
                                    {index === 1 && <FiPackage className="text-lg md:text-2xl" />}
                                    {index === 2 && <FiTruck className="text-lg md:text-2xl" />}
                                    {index === 3 && <FiMapPin className="text-lg md:text-2xl" />}
                                </div>
                                <span className={`text-[10px] md:text-sm font-medium mt-3 relative z-10 text-center ${index <= currentStep ? 'text-black' : 'text-black/50'}`}>
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                        <div className="border-2 border-black/10 rounded-lg p-6">
                            <h2 className="font-bold mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="flex items-center py-3 border-b-2 border-black/10 last:border-0">
                                        <div className="w-20 h-20 bg-[#242424]/5 rounded-lg overflow-hidden mr-4">
                                            {(() => {
                                                const imgSrc = resolveImageUrl(item.product?.image || item.product?.images?.[0]?.url);
                                                return imgSrc ? (
                                                    <img
                                                        src={imgSrc}
                                                        alt={item.product?.name || 'Product'}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <FiPackage size={24} />
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.product?.name || `Product #${item.product_id}`}</h3>
                                            {item.size && <p className="text-sm text-black/60">Size: {item.size}</p>}
                                            <p className="text-sm text-black/60">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                            <p className="text-sm text-black/60">Rp{item.price.toLocaleString('id-ID')} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Payment Info */}
                        <div className="border-2 border-black/10 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FiCreditCard className="text-black" size={20} />
                                <h2 className="font-bold">Payment Details</h2>
                            </div>

                            {transaction && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-[#242424]/5 rounded-lg border-2 border-black/10">
                                            <span className="text-[10px] uppercase tracking-wider text-black font-bold block mb-1">Method</span>
                                            <p className="text-sm text-black/60 capitalize font-medium">{transaction.payment_type?.replace(/_/g, ' ') || 'Midtrans'}</p>
                                        </div>
                                        <div className="p-3 bg-[#242424]/5 rounded-lg border-2 border-black/10">
                                            <span className="text-[10px] uppercase tracking-wider text-black font-bold block mb-1">Status</span>
                                            <p className="text-sm text-black/60 capitalize font-medium">{transaction.transaction_status}</p>
                                        </div>
                                    </div>

                                    {(transaction.va_number || transaction.bank || transaction.bill_key || transaction.payment_code) && (
                                        <div className="p-3 bg-[#242424]/5 rounded-lg border-2 border-black/10 space-y-2">
                                            {transaction.bank && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] uppercase tracking-wider text-black font-bold">Bank</span>
                                                    <span className="text-sm text-black/60 uppercase font-mono font-medium">{transaction.bank}</span>
                                                </div>
                                            )}
                                            {transaction.va_number && (
                                                <div className="flex justify-between items-center pt-2 border-t-2 border-black/10">
                                                    <span className="text-[10px] uppercase tracking-wider text-black font-bold">VA Number</span>
                                                    <span className="text-sm text-black/80 font-mono font-bold tracking-wider">{transaction.va_number}</span>
                                                </div>
                                            )}
                                            {transaction.payment_code && (
                                                <div className="flex justify-between items-center pt-2 border-t-2 border-black/10">
                                                    <span className="text-[10px] uppercase tracking-wider text-black font-bold">Payment Code</span>
                                                    <span className="text-sm text-black/80 font-mono font-bold tracking-wider">{transaction.payment_code}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="border-t-2 border-black/10 mt-6 pt-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <FiDollarSign className="text-black/40" size={16} />
                                        <span className="text-sm font-bold text-black uppercase tracking-wider">Total</span>
                                    </div>
                                    <span className="text-xl font-bold text-black font-mono">
                                        Rp{order.total_amount.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="border-2 border-black/10 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FiMapPin className="text-black" size={20} />
                                <h2 className="font-bold">Shipping Address</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 bg-[#242424]/5 rounded-lg border-2 border-black/10">
                                    <p className="text-sm font-bold text-black mb-1">{order.shipping_address}</p>
                                    <p className="text-sm text-black/60 leading-relaxed">
                                        {order.shipping_city}, {order.shipping_postal}
                                        <br />
                                        {order.shipping_country}
                                    </p>
                                </div>

                                {order.shipping_phone && (
                                    <div className="flex items-center gap-2 px-3 py-2 bg-[#242424]/5 rounded-lg border-2 border-black/10">
                                        <FiPhone className="text-black" size={14} />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-wider text-black font-bold">Contact Phone</span>
                                            <p className="text-sm text-black/60 font-mono">{order.shipping_phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pending Payment Action */}
                        {order.payment_status === 'pending' && order.snap_token && (
                            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-6">
                                <h2 className="font-bold mb-2 text-yellow-800">Complete Payment</h2>
                                <p className="text-sm text-yellow-700 mb-4">
                                    Your payment is still pending. Click below to complete your payment.
                                </p>
                                <button
                                    onClick={() => {
                                        if (window.snap && order.snap_token) {
                                            window.snap.pay(order.snap_token, {
                                                onSuccess: () => window.location.reload(),
                                                onPending: () => window.location.reload(),
                                                onError: () => alert('Payment failed'),
                                                onClose: () => { },
                                            });
                                        }
                                    }}
                                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition"
                                >
                                    Pay Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
