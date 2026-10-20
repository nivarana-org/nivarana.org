"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { setSubscriptionRedirect } from "@/utils/subscription-redirect";

interface CommentAuthPromptProps {
    isLoggedIn: boolean;
    returnUrl?: string;
}

export function CommentAuthPrompt({
    isLoggedIn,
    returnUrl,
}: CommentAuthPromptProps) {
    const router = useRouter();

    const handleSubscribeClick = () => {
        if (returnUrl) {
            setSubscriptionRedirect(returnUrl);
        }
        router.push("/profile#membership");
    };

    if (!isLoggedIn) {
        return (
            <div className="text-center py-4">
                <p className="text-nivarana-charcoal font-medium">
                    Become a member to add comments
                </p>
                <p className="text-sm text-gray-600 mt-1">
                    <button
                        onClick={handleSubscribeClick}
                        className="text-nivarana-blue hover:text-nivarana-green underline font-medium"
                    >
                        Subscribe now
                    </button>{" "}
                    or{" "}
                    <Link
                        href={
                            returnUrl
                                ? `/sign-in?return=${encodeURIComponent(returnUrl)}`
                                : "/sign-in"
                        }
                        className="text-nivarana-blue hover:text-nivarana-green underline"
                    >
                        sign in
                    </Link>{" "}
                    if you already have a membership
                </p>
            </div>
        );
    }

    return (
        <div className="text-center py-4">
            <p className="text-nivarana-charcoal font-medium">
                Become a member to add comments
            </p>
            <p className="text-sm text-gray-600 mt-1">
                Get access to comment on articles.{" "}
                <button
                    onClick={handleSubscribeClick}
                    className="text-nivarana-blue hover:text-nivarana-green underline"
                >
                    Subscribe now
                </button>
            </p>
        </div>
    );
}
