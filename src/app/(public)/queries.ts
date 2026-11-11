import { headers } from "next/headers";

import { getActiveSubscriptionByUserId } from "@/data/subscriptions";
import { auth } from "@/utils/auth";

export { getCategories } from "@/data/categories";
export { getOverview } from "@/data/queries";
export { getTagCloud } from "@/data/tags";

/**
 * The name to greet an active subscriber with in the header, or null for
 * everyone else (signed out, or signed in without an active subscription).
 */
export const getSubscriberName = async (): Promise<{
    name: string | null;
    subscriber: boolean;
} | null> => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        const userId = session?.user?.id;
        if (!userId) {
            return null;
        }

        const result = {
            name: session.user.name || session.user.email || null,
            subscriber: false,
        };

        const subscription = await getActiveSubscriptionByUserId(userId);
        if (!subscription) {
            return result;
        }
        result.subscriber = true;
        return result;
    } catch (err) {
        /*
            Never swallow Next.js control-flow errors (dynamic rendering
            bailouts, redirects, ...) - they are not failures, and catching
            one here would let the render continue with a stale static shell.
        */
        if (err && typeof err === "object" && "digest" in err) {
            throw err;
        }
        console.error(err);
        return null;
    }
};
