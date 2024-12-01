import { incrementBlogViewCount } from "@/network/api";
import { useEffect, useState } from "react"

export const useViewCount = (id: string, initialCount = 0) => {
    const [count, setCount] = useState(initialCount);
    useEffect(() => {
        incrementBlogViewCount(id).then(newCount => setCount(newCount))
    }, [id])
    return count;
}