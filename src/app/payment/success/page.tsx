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
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-black/20">
                {/* Success/Pending Icon */}
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${isPending ? 'bg-yellow-100' : 'bg-green-100'}`}>
                    {isPending ? (
                        <FiClock className="w-10 h-10 text-yellow-600" />
                    ) : (
                        <FiCheckCircle className="w-10 h-10 text-green-600" />
                    )}
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-black mb-2">
                    {isPending ? 'Payment Pending' : 'Payment Successful!'}
                </h1>

                <p className="text-black/50 mb-6">
                    {isPending
                        ? 'Your payment is being processed. Please complete the payment according to the instructions.'
                        : 'Thank you for your purchase. Your order has been confirmed.'}
                </p>

                {/* Order ID */}
                {orderId && (
                    <div className="bg-black/5 rounded-lg p-4 mb-6 border border-black/20">
                        <p className="text-sm text-black/50 mb-1">Order ID</p>
                        <p className="font-mono font-bold text-black">{orderId}</p>
                    </div>
                )}

                {/* Order Details */}
                {loading ? (
                    <div className="animate-pulse space-y-2 mb-6">
                        <div className="h-4 bg-black/5 rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-black/5 rounded w-1/2 mx-auto"></div>
                    </div>
                ) : orderDetails?.order && (
                    <div className="bg-black/5 rounded-lg p-4 mb-6 text-left border border-black/20">
                        <div className="flex justify-between mb-2">
                            <span className="text-black/50">Total Amount</span>
                            <span className="font-bold">Rp{orderDetails.order.total_amount?.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-black/50">Payment Status</span>
                            <span className={`font-medium ${orderDetails.transaction?.transaction_status === 'settlement' ? 'text-green-600' :
                                    orderDetails.transaction?.transaction_status === 'pending' ? 'text-yellow-600' :
                                        'text-gray-600'
                                }`}>
                                {orderDetails.transaction?.transaction_status || 'Processing'}
                            </span>
                        </div>
                        {orderDetails.transaction?.payment_type && (
                            <div className="flex justify-between">
                                <span className="text-black/50">Payment Method</span>
                                <span className="font-medium capitalize">{orderDetails.transaction.payment_type.replace(/_/g, ' ')}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Pending Payment Instructions */}
                {isPending && orderDetails?.transaction && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-bold text-yellow-800 mb-2">Payment Instructions</h3>
                        {orderDetails.transaction.va_number && (
                            <div className="mb-2">
                                <p className="text-sm text-yellow-700">Virtual Account Number:</p>
                                <p className="font-mono font-bold text-yellow-900">{orderDetails.transaction.va_number}</p>
                                {orderDetails.transaction.bank && (
                                    <p className="text-sm text-yellow-700">Bank: {orderDetails.transaction.bank.toUpperCase()}</p>
                                )}
                            </div>
                        )}
                        {orderDetails.transaction.payment_code && (
                            <div className="mb-2">
                                <p className="text-sm text-yellow-700">Payment Code:</p>
                                <p className="font-mono font-bold text-yellow-900">{orderDetails.transaction.payment_code}</p>
                            </div>
                        )}
                        {orderDetails.transaction.bill_key && (
                            <div className="mb-2">
                                <p className="text-sm text-yellow-700">Bill Key:</p>
                                <p className="font-mono font-bold text-yellow-900">{orderDetails.transaction.bill_key}</p>
                                <p className="text-sm text-yellow-700">Biller Code: {orderDetails.transaction.biller_code}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link
                        href="/orders"
                        className="flex items-center justify-center w-full bg-black text-white py-3 px-6 rounded-full hover:bg-black/90 transition"
                    >
                        <FiPackage className="mr-2" />
                        View My Orders
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-center w-full border border-black/20 py-3 px-6 rounded-full hover:bg-black/5 transition"
                    >
                        Continue Shopping
                        <FiArrowRight className="ml-2" />
                    </Link>
                </div>

                {/* Support Info */}
                <p className="text-xs text-gray-400 mt-6">
                    Questions? Contact us at support@pressa.com
                </p>
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
