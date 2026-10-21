"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent } from "react";

/**
 * The chapter a reader is on is not part of the address they can pass on.
 *
 * The chapter is still addressed as `?chapter=N` while it is being read, but
 * as soon as the chapter is on the screen the parameter is taken out of the
 * address bar again, so that the link somebody copies is the link to the
 * story and not to one chapter of it.
 */
export default function ClearChapter() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const clearAddressBar = useEffectEvent(() => {
        window.history.replaceState(null, "", pathname);
    });
    useEffect(() => {
        clearAddressBar();
    }, [searchParams]);
    return null;
}
