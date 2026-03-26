export type SubscriptionStatus =
    | "created"
    | "authenticated"
    | "active"
    | "pending"
    | "halted"
    | "cancelled"
    | "completed"
    | "expired"
    | "old";

export interface Plan {
    id: string;
    price: number;
    name: string;
    features: string[];
}

export interface UserSubscription {
    id: number;
    user_id: string;
    razorpay_subscription_id: string;
    plan_id: string;
    status: SubscriptionStatus;
    customer_email: string | null;
    current_start: number | null;
    current_end: number | null;
    charge_at: number | null;
    start_at: number | null;
    end_at: number | null;
    total_count: number | null;
    paid_count: number | null;
    remaining_count: number | null;
    auth_attempts: number;
    created_at: Date;
    updated_at: Date;
}

export interface SubscriptionPayment {
    id: number;
    user_subscription_id: number;
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    amount: number;
    currency: string;
    status: string;
    captured: boolean;
    razorpay_signature: string | null;
    verified: boolean;
    created_at: Date;
}

export interface WebhookEvent {
    id: number;
    razorpay_event_id: string;
    event_type: string;
    payload: object;
    processed: boolean;
    created_at: Date;
}

export interface CreateSubscriptionResponse {
    status: boolean;
    subscriptionId?: string;
    message?: string;
}

export interface VerifyPaymentResponse {
    status: boolean;
    verified?: boolean;
    message?: string;
}
