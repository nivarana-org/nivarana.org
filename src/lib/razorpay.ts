import Razorpay from "razorpay";
import crypto from "crypto";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

export const razorpay = new Razorpay({
    key_id: keyId || "",
    key_secret: keySecret || "",
});

export async function fetchSubscriptionFromRazorpay(
    subscriptionId: string,
): Promise<RazorpaySubscription | null> {
    try {
        const subscription = await razorpay.subscriptions.fetch(subscriptionId);
        return subscription as unknown as RazorpaySubscription;
    } catch (error) {
        console.error("Error fetching subscription from Razorpay:", error);
        return null;
    }
}

export const PLAN_IDS = {
    "100": process.env.RAZORPAY_PLAN_100 || "",
    "250": process.env.RAZORPAY_PLAN_250 || "",
    "500": process.env.RAZORPAY_PLAN_500 || "",
    "1000": process.env.RAZORPAY_PLAN_1000 || "",
} as const;

export type PlanPrice = keyof typeof PLAN_IDS;

export function getPlanIdByPrice(price: number): string | undefined {
    return PLAN_IDS[price as unknown as PlanPrice];
}

export function getPlanIdToPriceMapping(): Record<string, number> {
    const mapping: Record<string, number> = {};
    for (const [price, planId] of Object.entries(PLAN_IDS)) {
        if (planId) {
            mapping[planId] = Number(price);
        }
    }
    return mapping;
}

export function verifyPaymentSignature({
    paymentId,
    subscriptionId,
    signature,
}: {
    paymentId: string;
    subscriptionId: string;
    signature: string;
}): boolean {
    if (!keySecret) {
        console.error("RAZORPAY_KEY_SECRET not configured");
        return false;
    }

    const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${paymentId}|${subscriptionId}`)
        .digest("hex");

    return generatedSignature === signature;
}

export function verifyWebhookSignature({
    body,
    signature,
}: {
    body: string;
    signature: string;
}): boolean {
    if (!webhookSecret) {
        console.error("RAZORPAY_WEBHOOK_SECRET not configured");
        return false;
    }

    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(body, "utf8")
        .digest("hex");

    return expectedSignature === signature;
}

export interface RazorpaySubscription {
    id: string;
    entity: string;
    plan_id: string;
    customer_email: string | null;
    status: string;
    current_start: number | null;
    current_end: number | null;
    ended_at: number | null;
    quantity: number;
    notes: Record<string, string>;
    charge_at: number | null;
    start_at: number | null;
    end_at: number | null;
    auth_attempts: number;
    total_count: number;
    paid_count: number;
    customer_notify: boolean;
    created_at: number;
    expire_by: number | null;
    short_url: string | null;
    has_scheduled_changes: boolean;
    schedule_change_at: number | null;
    source: string;
    remaining_count: number;
}

export interface RazorpayPayment {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string | null;
    invoice_id: string | null;
    international: boolean;
    method: string;
    amount_refunded: number;
    refund_status: string | null;
    captured: boolean;
    description: string | null;
    card_id: string | null;
    bank: string | null;
    wallet: string | null;
    vpa: string | null;
    email: string | null;
    contact: string | null;
    notes: string[];
    fee: number | null;
    tax: number | null;
    error_code: string | null;
    error_description: string | null;
    created_at: number;
}

export interface RazorpayWebhookEvent {
    entity: string;
    account_id: string;
    event: string;
    contains: string[];
    payload: {
        payment?: {
            entity: RazorpayPayment;
        };
        subscription?: {
            entity: RazorpaySubscription;
        };
    };
    created_at: number;
}
