"use server";

import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { razorpay } from "@/lib/razorpay";
import * as subscriptionsDb from "@/data/subscriptions";
import type {
    CreateSubscriptionResponse,
    SubscriptionStatus,
} from "@/types/subscription";

export async function createSubscription(
    price: number,
): Promise<CreateSubscriptionResponse> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return { status: false, message: "Unauthorized" };
    }

    const plan = await subscriptionsDb.getPlanByPrice(price);
    if (!plan || !plan.razorpay_plan_id) {
        return { status: false, message: "Invalid plan" };
    }

    try {
        const existingSubscription =
            await subscriptionsDb.getActiveSubscriptionByUserId(
                session.user.id,
            );

        if (existingSubscription) {
            if (existingSubscription.plan_id === plan.razorpay_plan_id) {
                return {
                    status: true,
                    subscriptionId:
                        existingSubscription.razorpay_subscription_id,
                };
            }

            await subscriptionsDb.markSubscriptionAsOld(
                existingSubscription.razorpay_subscription_id,
            );

            const subscription = await razorpay.subscriptions.create({
                plan_id: plan.razorpay_plan_id,
                total_count: 12,
                customer_notify: true,
                notes: {
                    user_id: session.user.id,
                },
            });

            await subscriptionsDb.createSubscription({
                userId: session.user.id,
                razorpaySubscriptionId: subscription.id,
                planId: plan.razorpay_plan_id,
                customerEmail: session.user.email,
            });

            return {
                status: true,
                subscriptionId: subscription.id,
            };
        }

        const subscription = await razorpay.subscriptions.create({
            plan_id: plan.razorpay_plan_id,
            total_count: 12,
            customer_notify: true,
            notes: {
                user_id: session.user.id,
            },
        });

        await subscriptionsDb.createSubscription({
            userId: session.user.id,
            razorpaySubscriptionId: subscription.id,
            planId: plan.razorpay_plan_id,
            customerEmail: session.user.email,
        });

        return {
            status: true,
            subscriptionId: subscription.id,
        };
    } catch (error) {
        console.error("Error creating subscription:", error);
        return {
            status: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to create subscription",
        };
    }
}

export async function getSubscriptionStatus(): Promise<{
    status: boolean;
    subscription?: {
        id: string;
        planId: string;
        price: number;
        status: SubscriptionStatus;
    } | null;
    message?: string;
}> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return { status: false, message: "Unauthorized" };
    }

    try {
        const subscription = await subscriptionsDb.getSubscriptionByUserId(
            session.user.id,
        );

        if (!subscription) {
            return { status: true, subscription: null };
        }

        const plan = await subscriptionsDb.getPlanByRazorpayId(
            subscription.plan_id,
        );

        return {
            status: true,
            subscription: {
                id: subscription.razorpay_subscription_id,
                planId: subscription.plan_id,
                price: plan?.price ?? 0,
                status: subscription.status,
            },
        };
    } catch (error) {
        console.error("Error getting subscription status:", error);
        return {
            status: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to get subscription status",
        };
    }
}

export async function cancelSubscription(): Promise<{
    status: boolean;
    message?: string;
}> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return { status: false, message: "Unauthorized" };
    }

    try {
        const subscription = await subscriptionsDb.getSubscriptionByUserId(
            session.user.id,
        );

        if (!subscription) {
            return { status: false, message: "No active subscription" };
        }

        await razorpay.subscriptions.cancel(
            subscription.razorpay_subscription_id,
        );

        await subscriptionsDb.updateSubscriptionStatus({
            razorpaySubscriptionId: subscription.razorpay_subscription_id,
            status: "cancelled",
        });

        return { status: true };
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        return {
            status: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to cancel subscription",
        };
    }
}

export async function getRazorpayKey(): Promise<string | null> {
    return process.env.RAZORPAY_KEY_ID || null;
}

export async function syncSubscriptionFromRazorpay(): Promise<{
    status: boolean;
    subscription?: {
        id: string;
        planId: string;
        price: number;
        status: SubscriptionStatus;
    } | null;
    message?: string;
}> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return { status: false, message: "Unauthorized" };
    }

    try {
        const subscription = await subscriptionsDb.getSubscriptionByUserId(
            session.user.id,
        );

        if (!subscription) {
            return { status: false, message: "No subscription found" };
        }

        const synced = await subscriptionsDb.syncSubscriptionStatus(
            subscription.razorpay_subscription_id,
        );

        if (!synced) {
            return { status: false, message: "Failed to sync with Razorpay" };
        }

        const updatedSubscription =
            await subscriptionsDb.getSubscriptionByUserId(session.user.id);

        if (!updatedSubscription) {
            return { status: false, message: "Subscription not found" };
        }

        const plan = await subscriptionsDb.getPlanByRazorpayId(
            updatedSubscription.plan_id,
        );

        return {
            status: true,
            subscription: {
                id: updatedSubscription.razorpay_subscription_id,
                planId: updatedSubscription.plan_id,
                price: plan?.price ?? 0,
                status: updatedSubscription.status,
            },
        };
    } catch (error) {
        console.error("Error syncing subscription:", error);
        return {
            status: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to sync subscription",
        };
    }
}
