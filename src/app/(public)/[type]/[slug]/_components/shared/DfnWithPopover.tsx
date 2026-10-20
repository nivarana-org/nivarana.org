"use client";
import { useState, type ReactNode } from "react";

export function DfnWithPopover({
    children,
    title,
}: {
    children: ReactNode;
    title: string | null;
}) {
    const [showPopover, setShowPopover] = useState(false);

    return (
        <span className="relative inline-block">
            <dfn
                className="cursor-pointer text-blue-600 hover:text-blue-800"
                title={title || undefined}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowPopover(!showPopover);
                }}
            >
                {children}
            </dfn>
            {showPopover && title && (
                <span
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-48 bg-gray-800 text-white text-sm rounded py-2 px-3 text-center shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    {title}
                </span>
            )}
        </span>
    );
}
