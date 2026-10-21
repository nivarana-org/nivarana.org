"use client";

import { useViewCount } from "./useViewCount";

export default function ViewCountUpdateOnly({
    id,
    count: initialCount,
}: {
    id: number;
    count: number;
}) {
    useViewCount(id, initialCount);
    return null;
}
