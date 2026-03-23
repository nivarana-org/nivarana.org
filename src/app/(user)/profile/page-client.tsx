"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/utils/auth-client";
import { setPasswordAction } from "@/actions/user";

type Account = {
    id: string;
    userId: string;
    accountId: string;
    providerId: string;
    createdAt: Date;
    updatedAt: Date;
    scopes: string[];
};

type User = {
    id: string | number;
    email: string;
    name: string;
    image: string | null;
    emailVerified: boolean;
};

const MEMBERSHIP_PLANS = [
    {
        price: 100,
        name: "Supporter",
        features: ["Comment on articles"],
    },
    {
        price: 250,
        name: "Community",
        features: ["Comment on articles", "Join the community"],
    },
    {
        price: 500,
        name: "Meetups",
        features: [
            "Comment on articles",
            "Join the community",
            "Attend meetings",
        ],
    },
    {
        price: 1000,
        name: "Priority",
        features: [
            "Comment on articles",
            "Join the community",
            "Attend meetings",
            "Editorial priority",
            "Goodie bag",
        ],
    },
];

function GoogleIcon() {
    return (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export default function ProfilePageClient({ user }: { user: User }) {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [accountsLoaded, setAccountsLoaded] = useState(false);

    const hasPasswordAccount = accounts.some(
        (a) => a.providerId === "credential",
    );
    const hasGoogleAccount = accounts.some((a) => a.providerId === "google");
    const isOAuthOnly = !hasPasswordAccount;

    const [name, setName] = useState(user.name);
    const [nameEditing, setNameEditing] = useState(false);
    const [nameSubmitting, setNameSubmitting] = useState(false);
    const [nameMessage, setNameMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordSubmitting, setPasswordSubmitting] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const [oauthNewPassword, setOauthNewPassword] = useState("");
    const [oauthConfirmPassword, setOauthConfirmPassword] = useState("");
    const [oauthPasswordSubmitting, setOauthPasswordSubmitting] =
        useState(false);
    const [oauthPasswordMessage, setOauthPasswordMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    useEffect(() => {
        authClient.listAccounts().then(({ data }) => {
            setAccounts(data || []);
            setAccountsLoaded(true);
        });
    }, []);

    const handleNameUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setNameMessage({ type: "error", text: "Name cannot be empty" });
            return;
        }

        setNameSubmitting(true);
        setNameMessage(null);

        const { error } = await authClient.updateUser({
            name: name.trim(),
        });

        if (error) {
            setNameMessage({
                type: "error",
                text: error.message || "Failed to update name",
            });
        } else {
            setNameMessage({
                type: "success",
                text: "Name updated successfully",
            });
            setNameEditing(false);
        }
        setNameSubmitting(false);
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (newPassword.length < 8) {
            setPasswordMessage({
                type: "error",
                text: "Password must be at least 8 characters",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage({
                type: "error",
                text: "Passwords do not match",
            });
            return;
        }

        setPasswordSubmitting(true);

        const { error } = await authClient.changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: false,
        });

        if (error) {
            setPasswordMessage({
                type: "error",
                text: error.message || "Failed to change password",
            });
        } else {
            setPasswordMessage({
                type: "success",
                text: "Password changed successfully",
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
        setPasswordSubmitting(false);
    };

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setOauthPasswordMessage(null);

        if (oauthNewPassword.length < 8) {
            setOauthPasswordMessage({
                type: "error",
                text: "Password must be at least 8 characters",
            });
            return;
        }

        if (oauthNewPassword !== oauthConfirmPassword) {
            setOauthPasswordMessage({
                type: "error",
                text: "Passwords do not match",
            });
            return;
        }

        setOauthPasswordSubmitting(true);

        const formData = new FormData();
        formData.append("newPassword", oauthNewPassword);

        const result = await setPasswordAction(formData);

        if (result.error) {
            setOauthPasswordMessage({
                type: "error",
                text: result.error,
            });
        } else {
            setOauthPasswordMessage({
                type: "success",
                text: "Password set successfully",
            });
            setOauthNewPassword("");
            setOauthConfirmPassword("");
            authClient.listAccounts().then(({ data }) => {
                setAccounts(data || []);
            });
        }
        setOauthPasswordSubmitting(false);
    };

    const handleLinkGoogle = async () => {
        await authClient.linkSocial({
            provider: "google",
            callbackURL: "/profile?linked=true",
        });
    };

    if (!accountsLoaded) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-pulse text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">
                Profile Settings
            </h1>

            <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Profile Information
                </h2>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                        </label>
                        <p className="text-gray-900">{user.email}</p>
                        {user.emailVerified && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                                Verified
                            </span>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Display Name
                        </label>
                        <p className="text-gray-900">{name || "Not set"}</p>
                    </div>
                </div>
            </section>

            <section className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Change Name
                    </h2>
                    {!nameEditing && (
                        <button
                            onClick={() => setNameEditing(true)}
                            className="text-sm text-nivarana-blue hover:text-nivarana-blue/80 font-medium"
                        >
                            Edit
                        </button>
                    )}
                </div>
                {nameEditing ? (
                    <form onSubmit={handleNameUpdate} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nivarana-blue"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={nameSubmitting}
                                className="px-4 py-2 bg-nivarana-blue text-white rounded-md hover:bg-nivarana-blue/90 disabled:opacity-50"
                            >
                                {nameSubmitting ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setNameEditing(false);
                                    setName(user.name);
                                    setNameMessage(null);
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                        {nameMessage && (
                            <p
                                className={
                                    nameMessage.type === "success"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {nameMessage.text}
                            </p>
                        )}
                    </form>
                ) : (
                    <p className="text-sm text-gray-500">
                        Click Edit to change your display name.
                    </p>
                )}
            </section>

            {isOAuthOnly ? (
                <section className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Set Password
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Set a password to secure your account. You can use this
                        password to sign in with your email.
                    </p>
                    <form onSubmit={handleSetPassword} className="space-y-4">
                        <input
                            type="email"
                            name="username"
                            defaultValue={user.email}
                            autoComplete="username"
                            className="hidden"
                            readOnly
                            tabIndex={-1}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={oauthNewPassword}
                                onChange={(e) =>
                                    setOauthNewPassword(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nivarana-blue"
                                required
                                minLength={8}
                                autoComplete="new-password"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Minimum 8 characters
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={oauthConfirmPassword}
                                onChange={(e) =>
                                    setOauthConfirmPassword(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nivarana-blue"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={oauthPasswordSubmitting}
                            className="px-4 py-2 bg-nivarana-blue text-white rounded-md hover:bg-nivarana-blue/90 disabled:opacity-50"
                        >
                            {oauthPasswordSubmitting
                                ? "Setting..."
                                : "Set Password"}
                        </button>
                        {oauthPasswordMessage && (
                            <p
                                className={
                                    oauthPasswordMessage.type === "success"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {oauthPasswordMessage.text}
                            </p>
                        )}
                    </form>
                </section>
            ) : (
                <section className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Change Password
                    </h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <input
                            type="email"
                            name="username"
                            defaultValue={user.email}
                            autoComplete="username"
                            className="hidden"
                            readOnly
                            tabIndex={-1}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nivarana-blue"
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nivarana-blue"
                                required
                                minLength={8}
                                autoComplete="new-password"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Minimum 8 characters
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nivarana-blue"
                                required
                                autoComplete="new-password"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={passwordSubmitting}
                            className="px-4 py-2 bg-nivarana-blue text-white rounded-md hover:bg-nivarana-blue/90 disabled:opacity-50"
                        >
                            {passwordSubmitting
                                ? "Changing..."
                                : "Change Password"}
                        </button>
                        {passwordMessage && (
                            <p
                                className={
                                    passwordMessage.type === "success"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {passwordMessage.text}
                            </p>
                        )}
                    </form>
                </section>
            )}

            <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Linked Accounts
                </h2>
                <div className="space-y-3">
                    {hasPasswordAccount && (
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 flex items-center justify-center text-gray-500">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <span className="font-medium text-gray-900">
                                    {user.email}
                                </span>
                                <span className="text-xs text-gray-500">
                                    (Password)
                                </span>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckIcon />
                                Linked
                            </span>
                        </div>
                    )}
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                            <GoogleIcon />
                            <span className="font-medium text-gray-900">
                                Google
                            </span>
                        </div>
                        {hasGoogleAccount ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckIcon />
                                Linked
                            </span>
                        ) : hasPasswordAccount ? (
                            <button
                                onClick={handleLinkGoogle}
                                className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                            >
                                Link Account
                            </button>
                        ) : (
                            <span className="text-sm text-gray-500">
                                Not linked
                            </span>
                        )}
                    </div>
                </div>
                {!hasPasswordAccount && (
                    <p className="text-sm text-gray-500 mt-4">
                        You signed in with Google. Set a password above to
                        enable email sign-in.
                    </p>
                )}
            </section>

            <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Membership Plans
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Support Nivarana and unlock exclusive features.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {MEMBERSHIP_PLANS.map((plan) => (
                        <div
                            key={plan.price}
                            className="border border-gray-200 rounded-lg p-4 flex flex-col"
                        >
                            <div className="mb-4">
                                <span className="text-2xl font-bold text-gray-900">
                                    ₹{plan.price}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    /month
                                </span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">
                                {plan.name}
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-1 flex-grow">
                                {plan.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2"
                                    >
                                        <svg
                                            className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                disabled
                                className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-md text-sm font-medium cursor-not-allowed"
                            >
                                Coming Soon
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
