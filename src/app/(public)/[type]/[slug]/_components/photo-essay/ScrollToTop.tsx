"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
    const pathName = usePathname();
    const searchParams = useSearchParams();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathName, searchParams]);
    return null;
}
