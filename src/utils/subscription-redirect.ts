const STORAGE_KEY = "subscription_success_redirect";

export function setSubscriptionRedirect(url: string): void {
    if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, url);
    }
}

export function getSubscriptionRedirect(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
}

export function clearSubscriptionRedirect(): void {
    if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
    }
}

export function getAndClearSubscriptionRedirect(): string | null {
    const url = getSubscriptionRedirect();
    clearSubscriptionRedirect();
    return url;
}
