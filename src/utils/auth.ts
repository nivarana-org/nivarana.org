import { betterAuth } from "better-auth";
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
    plugins: [
        customSession(async ({ user, session }) => {
            const role = process.env.ADMINS?.includes(user.email)
                ? "admin"
                : "user";
            return {
                session,
                user: {
                    ...user,
                    role,
                },
            };
        }),
    ],
    socialProviders: {
        google: {
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
        },
    },
});
