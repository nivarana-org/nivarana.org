'use client'

import { incrementBlogViewCount } from "@/network/api";
import { useEffect } from "react";

export default function ViewCount({ slug, count }) {
    useEffect(() => {
        incrementBlogViewCount(slug)
    }, [slug])
    if (count > 0) return <li className="inline-flex items-center">
        <i className="icon-eyeglass mr-2" />
        {count}
    </li>
}