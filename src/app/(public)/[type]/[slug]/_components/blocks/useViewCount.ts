import { useEffect, useState } from "react";
import { increment } from "./viewCountIncrement.action";

export const useViewCount = (id: string, initialCount = 0) => {
    const [count, setCount] = useState(initialCount);
    useEffect(() => {
        increment(Number(id)).then((newCount) => setCount(newCount));
    }, [id]);
    return count;
};
