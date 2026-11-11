"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { NAV_TOGGLE_ID } from "./types";

/**
 * The mobile menu is a plain checkbox (see header.module.css), so its open
 * state survives client-side navigations. This closes it again whenever the
 * pathname changes. Everything it wraps stays server-rendered.
 */
export default function MenuCloser({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();

    useEffect(() => {
        const toggle = document.getElementById(
            NAV_TOGGLE_ID,
        ) as HTMLInputElement | null;
        if (toggle?.checked) {
            toggle.checked = false;
        }
    }, [pathname]);

    return <>{children}</>;
}
