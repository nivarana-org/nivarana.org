"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ClearChapter() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    useEffect(() => {
        const newUrl = pathname;
        window.history.replaceState(null, "", newUrl);
    }, [searchParams]);
    return null;
}
