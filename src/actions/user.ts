"use server";

import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export async function setPasswordAction(formData: FormData) {
    const newPassword = formData.get("newPassword") as string;

    if (!newPassword || newPassword.length < 8) {
        return { error: "Password must be at least 8 characters" };
    }

    try {
        await auth.api.setPassword({
            body: {
                newPassword,
            },
            headers: await headers(),
        });
        return { message: "Password set successfully" };
    } catch (error) {
        console.error("Error setting password:", error);
        return { error: "Failed to set password" };
    }
}
