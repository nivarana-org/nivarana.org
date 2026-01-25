import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const asAdmin =
    <A extends unknown[], R>(action: (...args: A) => R) =>
    async (...args: A): Promise<R> => {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session) redirect("/sign-in");
        if (session.user?.role !== "admin")
            throw new Error("Only admins can do that");
        return action(...args);
    };
