// src/services/paymentService.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export interface CartItem {
    product_id: string | number;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    variant_id?: string | number;
}

export interface ShippingInfo {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface CreateTransactionRequest {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_postal: string;
    shipping_country: string;
    items: CartItem[];
    total_amount: number;
}

export interface CreateTransactionResponse {
    order_id: string;
    midtrans_order_id: string;
    snap_token: string;
    snap_redirect_url: string;
}

export interface PaymentStatus {
    transaction: {
        id: number;
        order_id: number;
        midtrans_order_id: string;
        transaction_id: string;
        payment_type: string;
        gross_amount: number;
        transaction_status: string;
        fraud_status: string;
        snap_token?: string;
        snap_redirect_url?: string;
        va_number?: string;
        bank?: string;
        created_at: string;
        updated_at: string;
    };
    order: {
        id: number;
        order_number: string;
        status: string;
        total_amount: number;
        payment_status: string;
        items: any[];
    };
}

class PaymentService {
    private getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('auth_token');
    }

    async createTransaction(data: CreateTransactionRequest): Promise<CreateTransactionResponse> {
        const token = this.getAuthToken();

        if (!token) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_BASE_URL}/payments/create-transaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Payment creation failed: ${response.status}`);
        }

        return response.json();
    }

    async getPaymentStatus(orderId: string): Promise<PaymentStatus> {
        const token = this.getAuthToken();

        if (!token) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_BASE_URL}/payments/status/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to get payment status: ${response.status}`);
        }

        return response.json();
    }

    async getOrderByMidtransId(orderId: string): Promise<any> {
        const token = this.getAuthToken();

        if (!token) {
            throw new Error('User not authenticated');
        }

        const response = await fetch(`${API_BASE_URL}/orders/midtrans/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to get order: ${response.status}`);
        }

        return response.json();
    }
}

export const paymentService = new PaymentService();

// Type declarations for Midtrans Snap
declare global {
    interface Window {
        snap?: {
            pay: (
                token: string,
                options: {
                    onSuccess?: (result: any) => void;
                    onPending?: (result: any) => void;
                    onError?: (result: any) => void;
                    onClose?: () => void;
                }
            ) => void;
            embed: (
                token: string,
                options: {
                    embedId: string;
                    onSuccess?: (result: any) => void;
                    onPending?: (result: any) => void;
                    onError?: (result: any) => void;
                    onClose?: () => void;
                }
            ) => void;
        };
    }
}
