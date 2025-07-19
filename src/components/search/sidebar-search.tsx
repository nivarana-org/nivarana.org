"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { SearchIcon } from "./search-icon";

export default function Search({
    placeholder,
    postSubmit,
}: {
    placeholder: string;
    postSubmit?: () => void;
}) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        replace(`/search?${params.toString()}`);
    }, 300);

    return (
        <form
            className="relative flex flex-1 shrink-0"
            onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                const q = data.get("q");
                handleSearch(q);
                postSubmit();
            }}
        >
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                name="q"
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder={placeholder}
                defaultValue={searchParams.get("q")?.toString()}
            />

            <SearchIcon />
        </form>
    );
}
