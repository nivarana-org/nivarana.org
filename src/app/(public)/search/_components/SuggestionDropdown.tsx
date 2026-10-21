"use client";

import { Fragment, useEffect, useRef } from "react";

export type SuggestionOption = {
    id: string;
    label: string;
    /** Group header shown above a run of options; null for the plain text row. */
    group: string | null;
    href?: string;
};

type Props = {
    id: string;
    options: SuggestionOption[];
    activeIndex: number;
    onSelect: (option: SuggestionOption) => void;
    onHover: (index: number) => void;
};

export const SuggestionDropdown = ({
    id,
    options,
    activeIndex,
    onSelect,
    onHover,
}: Props) => {
    const activeRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Optional call: jsdom does not implement scrollIntoView.
        activeRef.current?.scrollIntoView?.({ block: "nearest" });
    }, [activeIndex]);

    return (
        <div
            id={id}
            role="listbox"
            aria-label="Search suggestions"
            className="absolute right-0 left-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
            onMouseDown={(e) => e.preventDefault()}
        >
            {options.map((option, index) => {
                const showHeader =
                    option.group !== null &&
                    option.group !== options[index - 1]?.group;
                const isActive = index === activeIndex;
                const isPlainSearch = option.group === null;
                return (
                    <Fragment key={option.id}>
                        {showHeader && (
                            <div
                                aria-hidden="true"
                                className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase"
                            >
                                {option.group}
                            </div>
                        )}
                        <div
                            ref={isActive ? activeRef : undefined}
                            id={option.id}
                            role="option"
                            aria-selected={isActive}
                            className={`cursor-pointer px-3 py-2 text-sm ${
                                isPlainSearch
                                    ? "mt-1 border-t border-gray-100 font-medium"
                                    : ""
                            } ${
                                isActive
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => onSelect(option)}
                            onMouseEnter={() => onHover(index)}
                        >
                            <span className="block truncate">
                                {option.label}
                            </span>
                        </div>
                    </Fragment>
                );
            })}
        </div>
    );
};
