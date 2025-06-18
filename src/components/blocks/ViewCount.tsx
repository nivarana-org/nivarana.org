"use client";

import { useViewCount } from "./useViewCount";

const CountIcon = () => (
    <span>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-eye"
        >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    </span>
);

export default function ViewCount({
    id,
    count: initialCount,
}: {
    id: string;
    count: number;
}) {
    const count = useViewCount(id, initialCount);
    return (
        <li className="inline-flex items-center">
            <CountIcon />
            <span className="ml-1">{count}</span>
        </li>
    );
}
