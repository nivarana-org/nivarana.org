"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import { SearchIcon } from "@/app/(public)/_components/search/search-icon";
import { SuggestionDropdown } from "./SuggestionDropdown";

import type { SuggestionOption } from "./SuggestionDropdown";
import type { Suggestions } from "@/types/nivarana";

const EMPTY_SUGGESTIONS: Suggestions = {
    authors: [],
    categories: [],
    tags: [],
};
const SUGGESTION_DEBOUNCE_MS = 200;
const SUGGEST_BOX_ID = "search-suggestions";

const toOptions = (group: string, items: Suggestions["authors"]) =>
    items.map((item) => ({
        id: `${group.toLowerCase()}-${item.path}`,
        label: item.name,
        group,
        href: item.href,
    }));

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const [term, setTerm] = useState(searchParams.get("q")?.toString() ?? "");
    const [suggestions, setSuggestions] =
        useState<Suggestions>(EMPTY_SUGGESTIONS);
    // The query the suggestions belong to, so stale groups are never shown.
    const [suggestionQuery, setSuggestionQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const trimmedTerm = term.trim();

    const applySearch = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set("q", value);
        } else {
            params.delete("q");
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleSearch = useDebouncedCallback(applySearch, 300);

    useEffect(() => {
        if (!open || !trimmedTerm) return;

        const query = trimmedTerm;
        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            try {
                const response = await fetch(
                    `/api/search/suggest?q=${encodeURIComponent(query)}`,
                    { signal: controller.signal },
                );
                if (!response.ok) {
                    throw new Error(
                        `Suggestions request failed with ${response.status}`,
                    );
                }
                const data = (await response.json()) as Suggestions;
                if (controller.signal.aborted) return;
                setSuggestions(data);
                setSuggestionQuery(query);
                setActiveIndex(-1);
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    console.error(err);
                }
            }
        }, SUGGESTION_DEBOUNCE_MS);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [open, trimmedTerm]);

    useEffect(() => {
        if (!open) return;
        const handlePointerDown = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node | null)) {
                setOpen(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener("pointerdown", handlePointerDown);
        return () =>
            document.removeEventListener("pointerdown", handlePointerDown);
    }, [open]);

    const visibleSuggestions =
        suggestionQuery === trimmedTerm ? suggestions : EMPTY_SUGGESTIONS;

    const options: SuggestionOption[] = [
        ...toOptions("Authors", visibleSuggestions.authors),
        ...toOptions("Categories", visibleSuggestions.categories),
        ...toOptions("Tags", visibleSuggestions.tags),
        {
            id: "search-text",
            label: `Search for “${trimmedTerm}”`,
            group: null,
        },
    ];

    const closeDropdown = () => {
        setOpen(false);
        setActiveIndex(-1);
    };

    const selectOption = (option: SuggestionOption) => {
        closeDropdown();
        if (option.href) {
            router.push(option.href);
            return;
        }
        applySearch(term);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            if (open) {
                event.preventDefault();
                closeDropdown();
            }
            return;
        }

        if (!open) {
            if (event.key === "Enter") {
                event.preventDefault();
                applySearch(term);
            }
            return;
        }

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setActiveIndex((index) => (index + 1) % options.length);
                break;
            case "ArrowUp":
                event.preventDefault();
                setActiveIndex((index) =>
                    index <= 0 ? options.length - 1 : index - 1,
                );
                break;
            case "Enter": {
                event.preventDefault();
                const option = activeIndex >= 0 ? options[activeIndex] : null;
                closeDropdown();
                if (option?.href) {
                    router.push(option.href);
                } else {
                    applySearch(term);
                }
                break;
            }
        }
    };

    return (
        <div className="relative flex flex-1 shrink-0" ref={containerRef}>
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                id="search"
                role="combobox"
                aria-expanded={open}
                aria-controls={SUGGEST_BOX_ID}
                aria-activedescendant={
                    activeIndex >= 0 ? options[activeIndex]?.id : undefined
                }
                aria-autocomplete="list"
                autoFocus={!Boolean(searchParams.get("q"))}
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder={placeholder}
                value={term}
                onChange={(e) => {
                    const value = e.target.value;
                    setTerm(value);
                    setActiveIndex(-1);
                    setOpen(value.trim().length > 0);
                    handleSearch(value);
                }}
                onFocus={() => {
                    if (trimmedTerm) setOpen(true);
                }}
                onKeyDown={onKeyDown}
            />

            <SearchIcon />

            {open && (
                <SuggestionDropdown
                    id={SUGGEST_BOX_ID}
                    options={options}
                    activeIndex={activeIndex}
                    onSelect={selectOption}
                    onHover={setActiveIndex}
                />
            )}
        </div>
    );
}
