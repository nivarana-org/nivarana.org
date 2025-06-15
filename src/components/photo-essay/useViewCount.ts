import { incrementBlogViewCount } from "@/data/cms";
import { useEffect, useState } from "react";

export const useViewCount = (id: string, initialCount = 0) => {
    const [count, setCount] = useState(initialCount);
    useEffect(() => {
        incrementBlogViewCount(Number(id)).then((newCount) =>
            setCount(newCount),
        );
    }, [id]);
    return count;
};
