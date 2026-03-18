"use client";
import { authClient } from "@/utils/auth-client";
import { useRouter } from "next/navigation";

export function LogOut({ inline }) {
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
    if (inline)
        return (
            <span
                role="button"
                className="cursor-pointer text-blue-500 p-4 bg-gray-300"
                onClick={logOut}
            >
                log out
            </span>
        );
    return <div onClick={logOut}>Log Out</div>;
}
