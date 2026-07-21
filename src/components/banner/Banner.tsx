"use client";

import { useEffect, useState } from "react";
import { getYouTubeId } from "@/utils/youtube";
interface BannerData {
    "banner.live": string | null;
    "banner.heading": string | null;
    "banner.content.head": string | null;
    "banner.content.foot": string | null;
    "banner.date": string | null;
}

const POLL_INTERVAL = 60_000;
const LS_KEY = "bannerMinimized";

export default function Banner() {
    const [banner, setBanner] = useState<BannerData | null>(null);
    const [storedDate] = useState(() => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(LS_KEY);
    });
    const [userMinimized, setUserMinimized] = useState<boolean | null>(null);

    const minimized = userMinimized ?? computeMinimized(banner, storedDate);

    useEffect(() => {
        let active = true;

        const fetchBanner = async () => {
            try {
                const response = await fetch("/api/banner", {
                    cache: "no-store",
                });
                if (!response.ok) return;
                const data = (await response.json()) as BannerData;
                if (active) setBanner(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchBanner();

        if (minimized !== false)
            return () => {
                active = false;
            };

        const interval = setInterval(fetchBanner, POLL_INTERVAL);

        return () => {
            active = false;
            clearInterval(interval);
        };
    }, [minimized]);

    const videoId = getYouTubeId(banner?.["banner.live"]);
    if (!videoId || minimized === null) return null;

    const heading = banner?.["banner.heading"] ?? "";
    const contentHead = banner?.["banner.content.head"] ?? "";
    const contentFoot = banner?.["banner.content.foot"] ?? "";

    if (minimized) {
        return (
            <button
                type="button"
                onClick={() => {
                    localStorage.removeItem(LS_KEY);
                    setUserMinimized(false);
                }}
                className="fixed bottom-4 left-4 z-[9999] rounded-full bg-nivarana-blue px-5 py-3 text-sm font-medium text-white shadow-lg hover:opacity-90"
            >
                {heading || "Watch live"}
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
            <div className="relative max-h-full w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-2xl">
                <button
                    type="button"
                    onClick={() => {
                        const today = new Date().toISOString().split("T")[0];
                        localStorage.setItem(LS_KEY, today);
                        setUserMinimized(true);
                    }}
                    aria-label="Minimize"
                    className="absolute right-3 top-3 rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>

                {heading && (
                    <h2 className="mb-4 pr-8 text-2xl font-bold">{heading}</h2>
                )}

                {contentHead && (
                    <div
                        className="prose mb-4 max-w-none"
                        dangerouslySetInnerHTML={{ __html: contentHead }}
                    />
                )}

                <div className="relative w-full overflow-hidden rounded-md pt-[56.25%]">
                    <iframe
                        className="absolute inset-0 h-full w-full"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                        title={heading || "Live video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>

                {contentFoot && (
                    <div
                        className="prose mt-4 max-w-none"
                        dangerouslySetInnerHTML={{ __html: contentFoot }}
                    />
                )}
            </div>
        </div>
    );
}

function computeMinimized(
    banner: BannerData | null,
    storedDate: string | null,
): boolean | null {
    if (!banner) return null;
    const videoId = getYouTubeId(banner["banner.live"]);
    if (!videoId) return null;
    const bannerDate = banner["banner.date"] ?? null;
    if (!bannerDate || !storedDate || storedDate < bannerDate) return false;
    return true;
}
