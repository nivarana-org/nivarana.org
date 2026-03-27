"use client";

import Link from "next/link";

interface CommentAuthPromptProps {
    isLoggedIn: boolean;
}

export function CommentAuthPrompt({ isLoggedIn }: CommentAuthPromptProps) {
    if (!isLoggedIn) {
        return (
            <div className="text-center py-4">
                <p className="text-nivarana-charcoal font-medium">
                    Become a member to add comments
                </p>
                <p className="text-sm text-gray-600 mt-1">
                    Already a member?{" "}
                    <Link
                        href="/sign-in"
                        className="text-nivarana-blue hover:text-nivarana-green underline"
                    >
                        Sign in
                    </Link>
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
                <Link
                    href="/profile#membership"
                    className="text-nivarana-blue hover:text-nivarana-green underline"
                >
                    Subscribe now
                </Link>
            </p>
        </div>
    );
}
