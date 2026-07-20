import { useEffect, useState } from "react";

export interface BannerData {
    "banner.live": string | null;
    "banner.heading": string | null;
    "banner.content.head": string | null;
    "banner.content.foot": string | null;
}

const POLL_INTERVAL = 60_000;

export const useBanner = () => {
    const [banner, setBanner] = useState<BannerData | null>(null);

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
        const interval = setInterval(fetchBanner, POLL_INTERVAL);

        return () => {
            active = false;
            clearInterval(interval);
        };
    }, []);

    return banner;
};
