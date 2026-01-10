'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiClock, FiPackage, FiArrowRight } from 'react-icons/fi';
import { paymentService } from '@/services/paymentService';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');
    const status = searchParams.get('status');

    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) return;

            try {
                const data = await paymentService.getPaymentStatus(orderId);
                setOrderDetails(data);
            } catch (error) {
                console.error('Failed to fetch order details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const isPending = status === 'pending';

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-black/20 flex flex-col md:flex-row-reverse text-left">

                {/* Right Side: Status & Actions */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-start">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isPending ? 'bg-yellow-100' : 'bg-green-100'}`}>
                        {isPending ? (
                            <FiClock className="w-8 h-8 text-yellow-600" />
                        ) : (
                            <FiCheckCircle className="w-8 h-8 text-green-600" />
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-black mb-3">
                        {isPending ? 'Payment Pending' : 'Payment Successful!'}
                    </h1>

                    <p className="text-black/60 mb-6 text-lg leading-relaxed">
                        {isPending
                            ? 'Your payment is being processed. Please complete the payment according to the instructions.'
                            : 'Thank you for your purchase. Your order has been confirmed and will be shipped soon.'}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full mt-auto">
                        <Link
                            href="/orders"
                            className="flex-1 flex items-center justify-center bg-black text-white py-3.5 px-6 rounded-full hover:bg-black/90 transition text-sm font-medium"
                        >
                            <FiPackage className="mr-2" />
                            View Orders
                        </Link>

                        <Link
                            href="/"
                            className="flex-1 flex items-center justify-center border border-black/20 py-3.5 px-6 rounded-full hover:bg-black/5 transition text-sm font-medium"
                        >
                            Continue Shopping
                            <FiArrowRight className="ml-2" />
                        </Link>
                    </div>

                    {/* Support Info */}
                    <p className="text-xs text-black/60 mt-8">
                        Questions? Contact us at support@pressa.com
                    </p>
                </div>

                {/* Left Side: Order Details */}
                <div className="w-full md:w-1/2 bg-black/5 p-8 md:p-12 border-t md:border-t-0 md:border-r border-black/10 flex flex-col justify-center">
                    {/* Order ID */}
                    {orderId && (
                        <div className="mb-8">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">Order ID</p>
                            <p className="font-mono text-xl font-bold text-black tracking-tight">{orderId}</p>
                        </div>
                    )}

                    {/* Order Details */}
                    {loading ? (
                        <div className="animate-pulse space-y-4 mb-6">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    ) : orderDetails?.order ? (
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between border-b border-black/10 pb-4">
                                <span className="text-black/60">Total Amount</span>
                                <span className="font-bold text-xl">Rp{orderDetails.order.total_amount?.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between border-b border-black/10 pb-4 items-center">
                                <span className="text-black/60">Payment Status</span>
                                <span className={`font-medium px-2 py-1 rounded-full text-xs uppercase tracking-wide ${orderDetails.transaction?.transaction_status === 'settlement' || orderDetails.transaction?.transaction_status === 'capture' ? 'bg-green-100 text-green-700 border-2 border-green-600/20' :
                                    orderDetails.transaction?.transaction_status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-600/20' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                    {orderDetails.transaction?.transaction_status || 'Processing'}
                                </span>
                            </div>
                            {orderDetails.transaction?.payment_type && (
                                <div className="flex justify-between border-b border-black/10 pb-4">
                                    <span className="text-black/60">Payment Method</span>
                                    <span className="font-bold capitalize">{orderDetails.transaction.payment_type.replace(/_/g, ' ')}</span>
                                </div>
                            )}
                        </div>
                    ) : null}

                    {/* Pending Payment Instructions */}
                    {isPending && orderDetails?.transaction && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 shadow-sm">
                            <h3 className="font-bold text-yellow-800 mb-3 flex items-center text-sm uppercase tracking-wide">
                                <FiClock className="mr-2" /> Payment Instructions
                            </h3>
                            {orderDetails.transaction.va_number && (
                                <div className="mb-3">
                                    <p className="text-xs text-yellow-700 mb-1">Virtual Account Number</p>
                                    <p className="font-mono font-bold text-lg text-yellow-900 tracking-wider copy-all">{orderDetails.transaction.va_number}</p>
                                    {orderDetails.transaction.bank && (
                                        <p className="text-xs text-yellow-700 mt-1">Bank: <span className="font-bold uppercase">{orderDetails.transaction.bank}</span></p>
                                    )}
                                </div>
                            )}
                            {orderDetails.transaction.payment_code && (
                                <div className="mb-3">
                                    <p className="text-xs text-yellow-700 mb-1">Payment Code</p>
                                    <p className="font-mono font-bold text-lg text-yellow-900 tracking-wider">{orderDetails.transaction.payment_code}</p>
                                </div>
                            )}
                            {orderDetails.transaction.bill_key && (
                                <div className="mb-3">
                                    <p className="text-xs text-yellow-700 mb-1">Bill Key</p>
                                    <p className="font-mono font-bold text-lg text-yellow-900 tracking-wider">{orderDetails.transaction.bill_key}</p>
                                    <p className="text-xs text-yellow-700 mt-1">Biller Code: <span className="font-bold">{orderDetails.transaction.biller_code}</span></p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
