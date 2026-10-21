import { getSuggestions } from "./queries";

import type { Suggestions } from "@/types/nivarana";

const EMPTY_SUGGESTIONS: Suggestions = {
    authors: [],
    categories: [],
    tags: [],
};

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const suggestions = await getSuggestions(searchParams.get("q") ?? "");
        return Response.json(suggestions, {
            headers: { "Cache-Control": "private, max-age=30" },
        });
    } catch (err) {
        console.error("Failed to fetch search suggestions", err);
        return Response.json(EMPTY_SUGGESTIONS, { status: 500 });
    }
}
