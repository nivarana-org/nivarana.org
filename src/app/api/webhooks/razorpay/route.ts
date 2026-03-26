import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import * as subscriptionsDb from "@/data/subscriptions";
import type { SubscriptionStatus } from "@/types/subscription";

async function parseRawBody(request: Request): Promise<string> {
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString("utf8");
}

export async function POST(request: NextRequest) {
    try {
        const signature = request.headers.get("X-Razorpay-Signature");
        if (!signature) {
            console.error("Missing X-Razorpay-Signature header");
            return NextResponse.json(
                { status: false, message: "Missing signature" },
                { status: 400 },
            );
        }

        const rawBody = await parseRawBody(request);

        const isValid = verifyWebhookSignature({
            body: rawBody,
            signature,
        });

        if (!isValid) {
            console.error("Invalid webhook signature");
            return NextResponse.json(
                { status: false, message: "Invalid signature" },
                { status: 400 },
            );
        }

        const payload = JSON.parse(rawBody);
        const event = payload.event as string;
        const eventId = `evt_${payload.created_at}_${Math.random().toString(36).substr(2, 9)}`;

        await subscriptionsDb.createWebhookEvent({
            razorpayEventId: eventId,
            eventType: event,
            payload,
        });

        const existingEvent =
            await subscriptionsDb.getWebhookEventById(eventId);
        if (existingEvent?.processed) {
            return NextResponse.json({
                status: true,
                message: "Already processed",
            });
        }

        if (event === "subscription.activated") {
            const subscription = payload.payload.subscription?.entity;
            if (subscription) {
                await subscriptionsDb.updateSubscriptionStatus({
                    razorpaySubscriptionId: subscription.id,
                    status: "active",
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
            }
        } else if (event === "subscription.authenticated") {
            const subscription = payload.payload.subscription?.entity;
            if (subscription) {
                await subscriptionsDb.updateSubscriptionStatus({
                    razorpaySubscriptionId: subscription.id,
                    status: "authenticated",
                    authAttempts: subscription.auth_attempts,
                });
            }
        } else if (event === "subscription.cancelled") {
            const subscription = payload.payload.subscription?.entity;
            if (subscription) {
                await subscriptionsDb.updateSubscriptionStatus({
                    razorpaySubscriptionId: subscription.id,
                    status: "cancelled",
                });
            }
        } else if (event === "subscription.halted") {
            const subscription = payload.payload.subscription?.entity;
            if (subscription) {
                await subscriptionsDb.updateSubscriptionStatus({
                    razorpaySubscriptionId: subscription.id,
                    status: "halted",
                });
            }
        } else if (event === "subscription.paused") {
            const subscription = payload.payload.subscription?.entity;
            if (subscription) {
                await subscriptionsDb.updateSubscriptionStatus({
                    razorpaySubscriptionId: subscription.id,
                    status: "paused" as SubscriptionStatus,
                });
            }
        } else if (event === "subscription.resumed") {
            const subscription = payload.payload.subscription?.entity;
            if (subscription) {
                await subscriptionsDb.updateSubscriptionStatus({
                    razorpaySubscriptionId: subscription.id,
                    status: "active",
                });
            }
        } else if (event === "subscription.completed") {
            const subscription = payload.payload.subscription?.entity;
            if (subscription) {
                await subscriptionsDb.updateSubscriptionStatus({
                    razorpaySubscriptionId: subscription.id,
                    status: "completed",
                });
            }
        } else if (event === "subscription.expired") {
            const subscription = payload.payload.subscription?.entity;
            if (subscription) {
                await subscriptionsDb.updateSubscriptionStatus({
                    razorpaySubscriptionId: subscription.id,
                    status: "expired",
                });
            }
        } else if (event === "payment.authorized") {
            const payment = payload.payload.payment?.entity;
            if (payment) {
                const subscription =
                    await subscriptionsDb.getSubscriptionByRazorpayId(
                        payment.order_id?.replace("order_", "sub_") || "",
                    );

                if (subscription) {
                    const existingPayment =
                        await subscriptionsDb.getPaymentByRazorpayId(
                            payment.id,
                        );
                    if (!existingPayment) {
                        await subscriptionsDb.createPayment({
                            userSubscriptionId: subscription.id,
                            razorpayPaymentId: payment.id,
                            razorpaySubscriptionId:
                                subscription.razorpay_subscription_id,
                            amount: payment.amount,
                            currency: payment.currency,
                            status: payment.status,
                        });
                    }
                }
            }
        } else if (event === "payment.captured") {
            const payment = payload.payload.payment?.entity;
            if (payment) {
                const existingPayment =
                    await subscriptionsDb.getPaymentByRazorpayId(payment.id);
                if (existingPayment) {
                    await subscriptionsDb.updatePaymentStatus(
                        payment.id,
                        payment.status,
                    );
                    await subscriptionsDb.capturePayment(payment.id);
                } else {
                    const subscription =
                        await subscriptionsDb.getSubscriptionByRazorpayId(
                            payment.order_id?.replace("order_", "sub_") || "",
                        );
                    if (subscription) {
                        await subscriptionsDb.createPayment({
                            userSubscriptionId: subscription.id,
                            razorpayPaymentId: payment.id,
                            razorpaySubscriptionId:
                                subscription.razorpay_subscription_id,
                            amount: payment.amount,
                            currency: payment.currency,
                            status: payment.status,
                        });
                        await subscriptionsDb.capturePayment(payment.id);
                    }
                }
            }
        } else if (event === "payment.failed") {
            const payment = payload.payload.payment?.entity;
            if (payment) {
                const existingPayment =
                    await subscriptionsDb.getPaymentByRazorpayId(payment.id);
                if (existingPayment && !existingPayment.captured) {
                    await subscriptionsDb.updatePaymentStatus(
                        payment.id,
                        payment.status,
                    );
                }
            }
        }

        await subscriptionsDb.markWebhookEventProcessed(eventId);

        return NextResponse.json({
            status: true,
            message: "Webhook processed",
        });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
            {
                status: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to process webhook",
            },
            { status: 500 },
        );
    }
}
