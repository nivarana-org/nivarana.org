'use client'

import { incrementBlogViewCount } from "@/network/api";
import { useEffect, useState } from "react";

export default function ViewCount({ id, count: initialCount }) {
    const [count, setCount] = useState(initialCount);
    useEffect(() => {
        const newCount = incrementBlogViewCount(id);
        setCount(newCount);
    }, [id])
    if (count > 0) return <li className="inline-flex items-center">
        <i className="icon-eyeglass mr-2" />
        {count}
    </li>
}