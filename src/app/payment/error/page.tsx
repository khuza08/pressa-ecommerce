'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiXCircle, FiRefreshCw, FiArrowLeft, FiMessageCircle } from 'react-icons/fi';

function PaymentErrorContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');
    const errorMessage = searchParams.get('message');

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {/* Error Icon */}
                <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-6">
                    <FiXCircle className="w-10 h-10 text-red-600" />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Payment Failed
                </h1>

                <p className="text-gray-600 mb-6">
                    {errorMessage || 'Unfortunately, your payment could not be processed. Please try again or choose a different payment method.'}
                </p>

                {/* Order ID */}
                {orderId && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-500 mb-1">Order ID</p>
                        <p className="font-mono font-bold text-gray-800">{orderId}</p>
                    </div>
                )}

                {/* Common Reasons */}
                <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-bold text-red-800 mb-2">Common Reasons:</h3>
                    <ul className="text-sm text-red-700 space-y-1">
                        <li>• Insufficient balance or credit limit</li>
                        <li>• Card declined by issuing bank</li>
                        <li>• Payment session expired</li>
                        <li>• Network connectivity issues</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link
                        href="/checkout"
                        className="flex items-center justify-center w-full bg-black text-white py-3 px-6 rounded-full hover:bg-black/90 transition"
                    >
                        <FiRefreshCw className="mr-2" />
                        Try Again
                    </Link>

                    <Link
                        href="/shop/cart"
                        className="flex items-center justify-center w-full border border-black/20 py-3 px-6 rounded-full hover:bg-black/5 transition"
                    >
                        <FiArrowLeft className="mr-2" />
                        Return to Cart
                    </Link>
                </div>

                {/* Support Info */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Need help?</p>
                    <a
                        href="mailto:support@pressa.com"
                        className="inline-flex items-center text-black hover:underline"
                    >
                        <FiMessageCircle className="mr-2" />
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function PaymentErrorPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        }>
            <PaymentErrorContent />
        </Suspense>
    );
}
