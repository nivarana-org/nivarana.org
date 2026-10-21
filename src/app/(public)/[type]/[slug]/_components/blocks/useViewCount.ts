import { useEffect, useState } from "react";
import { increment } from "./viewCountIncrement.action";

export const useViewCount = (id: number, initialCount = 0) => {
    const [count, setCount] = useState(initialCount);
    useEffect(() => {
        increment(Number(id)).then((newCount) => setCount(newCount ?? 0));
    }, [id]);
    return count;
};
