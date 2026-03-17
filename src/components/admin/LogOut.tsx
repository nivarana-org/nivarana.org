"use client";
import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";

export function LogOut() {
    const router = useRouter();
    const logOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in?return=/admin");
                },
            },
        });
    };
    return <div onClick={logOut}>Log Out</div>;
}
