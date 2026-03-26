import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { getSubscriptionStatus, getRazorpayKey } from "@/actions/subscription";
import { getAllPlans } from "@/data/subscriptions";
import ProfilePageClient from "./page-client";

export default async function ProfilePage() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        return <div>Loading...</div>;
    }

    const accountsResult = await auth.api.listUserAccounts({
        headers: await headers(),
    });

    const [subscriptionResult, razorpayKey, allPlans] = await Promise.all([
        getSubscriptionStatus(),
        getRazorpayKey(),
        getAllPlans(true),
    ]);

    const plans = allPlans.map((plan) => ({
        price: plan.price,
        name: plan.name,
        features: JSON.parse(plan.features || "[]") as string[],
    }));

    const userPlanId = subscriptionResult.subscription?.planId;

    const visiblePlans = plans.filter(
        (plan) =>
            allPlans.find((p) => p.price === plan.price)?.show_in_ui === 1 ||
            (userPlanId &&
                allPlans.find(
                    (p) =>
                        p.price === plan.price &&
                        p.razorpay_plan_id === userPlanId,
                )),
    );

    return (
        <ProfilePageClient
            user={{
                id: session.user.id,
                email: session.user.email,
                name: session.user.name || "",
                image: session.user.image || null,
                emailVerified: !!session.user.emailVerified,
            }}
            accounts={accountsResult}
            subscriptionStatus={
                subscriptionResult.status && subscriptionResult.subscription
                    ? subscriptionResult.subscription
                    : null
            }
            razorpayKey={razorpayKey}
            plans={visiblePlans}
        />
    );
}
