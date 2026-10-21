import type { Selectable } from "kysely";

import type { SubscriptionPayments, WebhookEvents } from "@/data/db.d";

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

/**
 * A row of `subscription_payments`, as it comes out of the database. The
 * boolean flags are stored as tinyints there.
 */
export type SubscriptionPaymentRow = Selectable<SubscriptionPayments>;

/**
 * A row of `webhook_events`, as it comes out of the database.
 */
export type WebhookEventRow = Selectable<WebhookEvents>;

/**
 * A payment as the application sees it: the database row with its tinyint
 * flags and its JSON payload turned back into the types they stand for.
 */
export type SubscriptionPayment = Omit<
    SubscriptionPaymentRow,
    "captured" | "verified" | "currency"
> & {
    currency: string;
    captured: boolean;
    verified: boolean;
};

/**
 * A webhook event as the application sees it.
 */
export type WebhookEvent = Omit<WebhookEventRow, "payload" | "processed"> & {
    payload: object;
    processed: boolean;
};

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
