"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent } from "react";

export default function ClearChapter() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const clearAddressBar = useEffectEvent(() => {
        const newUrl = pathname;
        window.history.replaceState(null, "", newUrl);
    });
    useEffect(() => {
        clearAddressBar();
    }, [searchParams]);
    return null;
}
