import { apiService } from './apiService';

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
    async createTransaction(data: CreateTransactionRequest): Promise<CreateTransactionResponse> {
        return apiService.post('/payments/create-transaction', data);
    }

    async getPaymentStatus(orderId: string): Promise<PaymentStatus> {
        return apiService.get(`/payments/status/${orderId}`);
    }

    async getOrderByMidtransId(orderId: string): Promise<any> {
        return apiService.get(`/orders/midtrans/${orderId}`);
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
