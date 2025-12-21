import { betterAuth } from "better-auth";
import { customSession } from "better-auth/plugins";
import { createPool } from "mysql2/promise";
import { headers } from "next/headers";

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
