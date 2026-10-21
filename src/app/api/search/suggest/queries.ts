import { db } from "@/data/db";

import {
    MIN_SUGGESTION_LENGTH,
    SUGGESTION_CANDIDATE_LIMIT,
    hasPublishedPost,
    normalizeQuery,
    suggestionMatchCondition,
    suggestionRank,
    toSuggestions,
} from "./matching";

import type { Suggestions } from "@/types/nivarana";

const getAuthorSuggestions = (query: string) =>
    db
        .selectFrom("authors as a")
        .select(["a.name", "a.slug as path"])
        .where(suggestionMatchCondition("a.name", query))
        .where(hasPublishedPost("author", "a.id"))
        .orderBy(suggestionRank("a.name", query))
        .orderBy("a.name")
        .limit(SUGGESTION_CANDIDATE_LIMIT)
        .execute();

const getCategorySuggestions = (query: string) =>
    db
        .selectFrom("categories as c")
        .select(["c.name", "c.path"])
        .where(suggestionMatchCondition("c.name", query))
        .where(hasPublishedPost("category", "c.id"))
        .orderBy(suggestionRank("c.name", query))
        .orderBy("c.name")
        .limit(SUGGESTION_CANDIDATE_LIMIT)
        .execute();

const getTagSuggestions = (query: string) =>
    db
        .selectFrom("tags as t")
        .select(["t.name", "t.path"])
        .where(suggestionMatchCondition("t.name", query))
        .where(hasPublishedPost("tag", "t.id"))
        .orderBy(suggestionRank("t.name", query))
        .orderBy("t.name")
        .limit(SUGGESTION_CANDIDATE_LIMIT)
        .execute();

export const getSuggestions = async (
    rawQuery: string,
): Promise<Suggestions> => {
    const query = normalizeQuery(rawQuery);
    if (query.length < MIN_SUGGESTION_LENGTH) {
        return { authors: [], categories: [], tags: [] };
    }

    const [authors, categories, tags] = await Promise.all([
        getAuthorSuggestions(query),
        getCategorySuggestions(query),
        getTagSuggestions(query),
    ]);

    return {
        authors: toSuggestions(authors, "/author/"),
        categories: toSuggestions(categories, "/category/"),
        tags: toSuggestions(tags, "/tag/"),
    };
};
