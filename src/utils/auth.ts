import "server-only";
import { betterAuth } from "better-auth";
import { customSession } from "better-auth/plugins";
import { createPool } from "mysql2/promise";
import { headers } from "next/headers";
import { sendEmail } from "./mail";

export const auth = betterAuth({
    database: createPool({
        host: process.env.DB_HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DATABASE,
        charset: "utf8mb4",
        connectionLimit: 2,
    }),
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
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        onExistingUserSignUp: async ({ user }, request) => {
            console.log(user);
            console.log(request);
            void sendEmail({
                to: user.email,
                subject: "Sign-up attempt with your email",
                text:
                    "Someone tried to create an account using your email address. " +
                    "If this was you, you already have an account! Try signing in instead\n. " +
                    "If not, you can safely ignore this email.",
            });
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
            void sendEmail({
                to: user.email,
                subject: "Verify your email address",
                text: `Click the link to verify your email: ${url}`,
            });
        },
    },
    rateLimit: {
        window: 300, // time window in seconds
        max: 5, // max requests in the window
    },
    socialProviders: {
        google: {
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
        },
    },
});

export const getRole = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return session?.user?.role;
};
