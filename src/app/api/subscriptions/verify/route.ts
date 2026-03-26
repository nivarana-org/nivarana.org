import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { verifyPaymentSignature } from "@/lib/razorpay";
import * as subscriptionsDb from "@/data/subscriptions";

export async function POST(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return NextResponse.json(
            { status: false, message: "Unauthorized" },
            { status: 401 },
        );
    }

    try {
        const body = await request.json();
        const { subscriptionId, paymentId, signature } = body;

        if (!subscriptionId || !paymentId || !signature) {
            return NextResponse.json(
                { status: false, message: "Missing required fields" },
                { status: 400 },
            );
        }

        const subscription =
            await subscriptionsDb.getSubscriptionByRazorpayId(subscriptionId);

        if (!subscription) {
            return NextResponse.json(
                { status: false, message: "Subscription not found" },
                { status: 404 },
            );
        }

        if (subscription.user_id !== session.user.id) {
            return NextResponse.json(
                { status: false, message: "Unauthorized" },
                { status: 403 },
            );
        }

        const isValid = verifyPaymentSignature({
            paymentId,
            subscriptionId,
            signature,
        });

        if (!isValid) {
            return NextResponse.json(
                { status: false, message: "Invalid signature" },
                { status: 400 },
            );
        }

        const existingPayment =
            await subscriptionsDb.getPaymentByRazorpayId(paymentId);

        if (!existingPayment) {
            await subscriptionsDb.createPayment({
                userSubscriptionId: subscription.id,
                razorpayPaymentId: paymentId,
                razorpaySubscriptionId: subscriptionId,
                amount: 0,
                status: "authorized",
                razorpaySignature: signature,
            });
        }

        await subscriptionsDb.verifyPayment(paymentId);

        await subscriptionsDb.syncSubscriptionStatus(subscriptionId);

        return NextResponse.json({
            status: true,
            verified: true,
            message: "Payment verified successfully",
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json(
            {
                status: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to verify payment",
            },
            { status: 500 },
        );
    }
}
