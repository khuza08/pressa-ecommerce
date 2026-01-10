'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiPackage, FiArrowLeft, FiClock, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

interface Order {
    id: number;
    order_number: string;
    midtrans_order_id: string;
    status: string;
    total_amount: number;
    payment_status: string;
    created_at: string;
    items: {
        id: number;
        product_id: number;
        quantity: number;
        price: number;
        product?: {
            name: string;
            image: string;
        };
    }[];
}

export default function OrdersPage() {
    const { isAuthenticated, getToken } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth?redirect=/orders');
            return;
        }

        const fetchOrders = async () => {
            try {
                const token = getToken();
                const response = await fetch(`${API_BASE_URL}/orders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data.orders || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, getToken, router]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'processing':
            case 'shipped':
                return <FiLoader className="text-blue-500" />;
            case 'completed':
            case 'delivered':
                return <FiCheckCircle className="text-green-500" />;
            case 'cancelled':
            case 'refunded':
                return <FiXCircle className="text-red-500" />;
            default:
                return <FiClock className="text-yellow-500" />;
        }
    };

    const getPaymentStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
            paid: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            challenge: 'bg-orange-100 text-orange-800',
            deny: 'bg-red-100 text-red-800',
            cancel: 'bg-red-100 text-red-800',
            expire: 'bg-gray-100 text-gray-800',
            refunded: 'bg-purple-100 text-purple-800',
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <FiLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-black" />
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="w-full md:w-[90vw] lg:w-[80vw] mx-auto px-4">
                <div className="mb-6">
                    <Link href="/" className="flex items-center text-black/60 hover:text-black">
                        <FiArrowLeft className="mr-2" />
                        Back to Home
                    </Link>
                </div>

                <h1 className="text-2xl font-bold mb-8 flex items-center">
                    <FiPackage className="mr-3" />
                    My Orders
                </h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <FiPackage className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-medium text-gray-600 mb-2">No orders yet</h2>
                        <p className="text-gray-400 mb-6">Start shopping to see your orders here.</p>
                        <Link
                            href="/products"
                            className="inline-block bg-black text-white py-3 px-6 rounded-full hover:bg-black/90 transition"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="border border-black/10 rounded-lg p-6 hover:border-black/30 transition">
                                <div className="flex flex-wrap items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {getStatusIcon(order.status)}
                                            <span className="font-bold">{order.order_number}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">Rp{order.total_amount.toLocaleString('id-ID')}</p>
                                        {getPaymentStatusBadge(order.payment_status)}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-black/10">
                                    <div className="text-sm text-gray-500">
                                        {order.items?.length || 0} item(s)
                                    </div>
                                    <Link
                                        href={`/orders/${order.midtrans_order_id || order.id}`}
                                        className="text-sm font-medium text-black hover:underline"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
