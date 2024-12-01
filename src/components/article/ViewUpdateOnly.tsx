'use client'

import { useViewCount } from "./useViewCount";

export default function ViewCountUpdateOnly({ id, count: initialCount }: {id: string, count: number}) {
    useViewCount(id, initialCount);
    return null;
}