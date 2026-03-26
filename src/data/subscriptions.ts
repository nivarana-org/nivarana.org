import { db } from "./db";
import { fetchSubscriptionFromRazorpay } from "@/lib/razorpay";
import type {
    UserSubscription,
    SubscriptionPayment,
    WebhookEvent,
    SubscriptionStatus,
} from "@/types/subscription";

export async function syncSubscriptionStatus(
    razorpaySubscriptionId: string,
): Promise<boolean> {
    const subscription = await fetchSubscriptionFromRazorpay(
        razorpaySubscriptionId,
    );

    if (!subscription) {
        return false;
    }

    const statusMap: Record<string, SubscriptionStatus> = {
        created: "created",
        authenticated: "authenticated",
        active: "active",
        pending: "pending",
        halted: "halted",
        cancelled: "cancelled",
        completed: "completed",
        expired: "expired",
    };

    const mappedStatus = statusMap[subscription.status] || "created";

    await updateSubscriptionStatus({
        razorpaySubscriptionId,
        status: mappedStatus,
        currentStart: subscription.current_start,
        currentEnd: subscription.current_end,
        chargeAt: subscription.charge_at,
        startAt: subscription.start_at,
        endAt: subscription.end_at,
        totalCount: subscription.total_count,
        paidCount: subscription.paid_count,
        remainingCount: subscription.remaining_count,
        authAttempts: subscription.auth_attempts,
    });

    return true;
}

export async function createSubscription({
    userId,
    razorpaySubscriptionId,
    planId,
    customerEmail,
}: {
    userId: string;
    razorpaySubscriptionId: string;
    planId: string;
    customerEmail: string;
}): Promise<UserSubscription> {
    await db
        .insertInto("user_subscriptions")
        .values({
            user_id: userId,
            razorpay_subscription_id: razorpaySubscriptionId,
            plan_id: planId,
            status: "created",
            customer_email: customerEmail,
            auth_attempts: 0,
        })
        .execute();

    const [subscription] = await db
        .selectFrom("user_subscriptions")
        .where("razorpay_subscription_id", "=", razorpaySubscriptionId)
        .selectAll()
        .execute();

    return subscription as unknown as UserSubscription;
}

export async function getSubscriptionByUserId(
    userId: string,
): Promise<UserSubscription | null> {
    const [subscription] = await db
        .selectFrom("user_subscriptions")
        .where("user_id", "=", userId)
        .where("status", "!=", "old")
        .orderBy("created_at", "desc")
        .selectAll()
        .execute();

    return (subscription as unknown as UserSubscription) || null;
}

export async function getSubscriptionByRazorpayId(
    razorpaySubscriptionId: string,
): Promise<UserSubscription | null> {
    const [subscription] = await db
        .selectFrom("user_subscriptions")
        .where("razorpay_subscription_id", "=", razorpaySubscriptionId)
        .selectAll()
        .execute();

    return (subscription as unknown as UserSubscription) || null;
}

export async function getActiveSubscriptionByUserId(
    userId: string,
): Promise<UserSubscription | null> {
    const [subscription] = await db
        .selectFrom("user_subscriptions")
        .where("user_id", "=", userId)
        .where("status", "=", "active")
        .selectAll()
        .execute();

    return (subscription as unknown as UserSubscription) || null;
}

export async function updateSubscriptionStatus({
    razorpaySubscriptionId,
    status,
    currentStart,
    currentEnd,
    chargeAt,
    startAt,
    endAt,
    totalCount,
    paidCount,
    remainingCount,
    authAttempts,
}: {
    razorpaySubscriptionId: string;
    status: SubscriptionStatus;
    currentStart?: number | null;
    currentEnd?: number | null;
    chargeAt?: number | null;
    startAt?: number | null;
    endAt?: number | null;
    totalCount?: number | null;
    paidCount?: number | null;
    remainingCount?: number | null;
    authAttempts?: number;
}): Promise<void> {
    await db
        .updateTable("user_subscriptions")
        .where("razorpay_subscription_id", "=", razorpaySubscriptionId)
        .set({
            status,
            current_start: currentStart ?? undefined,
            current_end: currentEnd ?? undefined,
            charge_at: chargeAt ?? undefined,
            start_at: startAt ?? undefined,
            end_at: endAt ?? undefined,
            total_count: totalCount ?? undefined,
            paid_count: paidCount ?? undefined,
            remaining_count: remainingCount ?? undefined,
            auth_attempts: authAttempts ?? undefined,
        })
        .execute();
}

export async function markSubscriptionAsOld(
    razorpaySubscriptionId: string,
): Promise<void> {
    await db
        .updateTable("user_subscriptions")
        .where("razorpay_subscription_id", "=", razorpaySubscriptionId)
        .where("status", "!=", "old")
        .set({ status: "old" })
        .execute();
}

export async function cancelSubscription(
    razorpaySubscriptionId: string,
): Promise<void> {
    await db
        .updateTable("user_subscriptions")
        .where("razorpay_subscription_id", "=", razorpaySubscriptionId)
        .set({ status: "cancelled" })
        .execute();
}

export async function createPayment({
    userSubscriptionId,
    razorpayPaymentId,
    razorpaySubscriptionId,
    amount,
    currency,
    status,
    razorpaySignature,
}: {
    userSubscriptionId: number;
    razorpayPaymentId: string;
    razorpaySubscriptionId: string;
    amount: number;
    currency?: string;
    status: string;
    razorpaySignature?: string;
}): Promise<SubscriptionPayment> {
    await db
        .insertInto("subscription_payments")
        .values({
            user_subscription_id: userSubscriptionId,
            razorpay_payment_id: razorpayPaymentId,
            razorpay_subscription_id: razorpaySubscriptionId,
            amount,
            currency: currency || "INR",
            status,
            captured: false,
            razorpay_signature: razorpaySignature || null,
            verified: false,
        })
        .execute();

    const [payment] = await db
        .selectFrom("subscription_payments")
        .where("razorpay_payment_id", "=", razorpayPaymentId)
        .selectAll()
        .execute();

    return payment as SubscriptionPayment;
}

export async function getPaymentByRazorpayId(
    razorpayPaymentId: string,
): Promise<SubscriptionPayment | null> {
    const [payment] = await db
        .selectFrom("subscription_payments")
        .where("razorpay_payment_id", "=", razorpayPaymentId)
        .selectAll()
        .execute();

    return payment || null;
}

export async function verifyPayment(razorpayPaymentId: string): Promise<void> {
    await db
        .updateTable("subscription_payments")
        .where("razorpay_payment_id", "=", razorpayPaymentId)
        .set({ verified: true })
        .execute();
}

export async function capturePayment(razorpayPaymentId: string): Promise<void> {
    await db
        .updateTable("subscription_payments")
        .where("razorpay_payment_id", "=", razorpayPaymentId)
        .set({ captured: true })
        .execute();
}

export async function updatePaymentStatus(
    razorpayPaymentId: string,
    status: string,
): Promise<void> {
    const existing = await getPaymentByRazorpayId(razorpayPaymentId);
    if (!existing) return;

    await db
        .updateTable("subscription_payments")
        .where("razorpay_payment_id", "=", razorpayPaymentId)
        .set({
            status,
            captured: existing.captured || status === "captured",
        })
        .execute();
}

export async function getPaymentsBySubscriptionId(
    razorpaySubscriptionId: string,
): Promise<SubscriptionPayment[]> {
    const payments = await db
        .selectFrom("subscription_payments")
        .where("razorpay_subscription_id", "=", razorpaySubscriptionId)
        .orderBy("created_at", "desc")
        .selectAll()
        .execute();

    return payments as SubscriptionPayment[];
}

export async function createWebhookEvent({
    razorpayEventId,
    eventType,
    payload,
}: {
    razorpayEventId: string;
    eventType: string;
    payload: object;
}): Promise<WebhookEvent> {
    const existing = await getWebhookEventById(razorpayEventId);
    if (existing) {
        return existing;
    }

    await db
        .insertInto("webhook_events")
        .values({
            razorpay_event_id: razorpayEventId,
            event_type: eventType,
            payload: payload as never,
            processed: false,
        })
        .execute();

    const [event] = await db
        .selectFrom("webhook_events")
        .where("razorpay_event_id", "=", razorpayEventId)
        .selectAll()
        .execute();

    return event as unknown as WebhookEvent;
}

export async function markWebhookEventProcessed(
    razorpayEventId: string,
): Promise<void> {
    await db
        .updateTable("webhook_events")
        .where("razorpay_event_id", "=", razorpayEventId)
        .set({ processed: true })
        .execute();
}

export async function getWebhookEventById(
    razorpayEventId: string,
): Promise<WebhookEvent | null> {
    const [event] = await db
        .selectFrom("webhook_events")
        .where("razorpay_event_id", "=", razorpayEventId)
        .selectAll()
        .execute();

    return event || null;
}

export interface MembershipPlan {
    id: number;
    razorpay_plan_id: string;
    price: number;
    name: string;
    features: string;
    show_in_ui: number | null;
    created_at: Date | null;
    updated_at: Date | null;
}

export async function getAllPlans(
    includeHidden = false,
): Promise<MembershipPlan[]> {
    let query = db.selectFrom("membership_plans").selectAll();

    if (!includeHidden) {
        query = query.where("show_in_ui", "=", 1);
    }

    const plans = await query.orderBy("price", "asc").execute();
    return plans as unknown as MembershipPlan[];
}

export async function getPlanByPrice(
    price: number,
): Promise<MembershipPlan | null> {
    const [plan] = await db
        .selectFrom("membership_plans")
        .where("price", "=", price)
        .selectAll()
        .execute();

    return (plan as unknown as MembershipPlan) || null;
}

export async function getPlanByRazorpayId(
    razorpayPlanId: string,
): Promise<MembershipPlan | null> {
    const [plan] = await db
        .selectFrom("membership_plans")
        .where("razorpay_plan_id", "=", razorpayPlanId)
        .selectAll()
        .execute();

    return (plan as unknown as MembershipPlan) || null;
}
