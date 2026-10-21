import { db } from "@/data/db";
import {
    authorsFragment,
    categoriesFragment,
    tagsFragment,
} from "@/data/queries";
import { sql, SqlBool } from "kysely";

import {
    MIN_SUGGESTION_LENGTH,
    SUGGESTION_CANDIDATE_LIMIT,
    hasPublishedPost,
    normalizeQuery,
    suggestionMatchCondition,
    suggestionRank,
    toSuggestions,
} from "./_lib/matching";

export type SuggestionLink = {
    name: string;
    href: string;
};

export type SearchSuggestions = {
    authors: SuggestionLink[];
    categories: SuggestionLink[];
    tags: SuggestionLink[];
};

export const EMPTY_SUGGESTIONS: SearchSuggestions = {
    authors: [],
    categories: [],
    tags: [],
};

export const searchArticles = (query: string) =>
    db
        .selectFrom("blogs as b")
        .select([
            "b.id",
            "b.title",
            "b.slug",
            "b.contents",
            "b.image",
            "b.intro",
            "b.created_at",
            "b.updated_at",
            "b.type",
            "b.published_at",
            authorsFragment.as("authors"),
            categoriesFragment.as("category"),
            tagsFragment.as("tags"),
        ])
        .where("b.status", "=", "PUBLISHED")
        .where(
            sql<SqlBool>`MATCH(b.title, b.contents, b.intro) AGAINST (${query})`,
        )
        .execute();

const getAuthorSuggestions = (query: string) =>
    db
        .selectFrom("authors as a")
        .select(["a.name", "a.slug"])
        .where(suggestionMatchCondition("a.name", query))
        .where(hasPublishedPost("author", "a.id"))
        .orderBy(suggestionRank("a.name", query))
        .orderBy("a.name")
        .limit(SUGGESTION_CANDIDATE_LIMIT)
        .execute();

const getCategorySuggestions = (query: string) =>
    db
        .selectFrom("categories as c")
        .select(["c.name", "c.slug"])
        .where(suggestionMatchCondition("c.name", query))
        .where(hasPublishedPost("category", "c.id"))
        .orderBy(suggestionRank("c.name", query))
        .orderBy("c.name")
        .limit(SUGGESTION_CANDIDATE_LIMIT)
        .execute();

const getTagSuggestions = (query: string) =>
    db
        .selectFrom("tags as t")
        .select(["t.name", "t.slug"])
        .where(suggestionMatchCondition("t.name", query))
        .where(hasPublishedPost("tag", "t.id"))
        .orderBy(suggestionRank("t.name", query))
        .orderBy("t.name")
        .limit(SUGGESTION_CANDIDATE_LIMIT)
        .execute();

/** Well-matched authors/categories/tags to show above the article results. */
export const getSearchSuggestions = async (
    rawQuery: string,
): Promise<SearchSuggestions> => {
    const query = normalizeQuery(rawQuery);
    if (query.length < MIN_SUGGESTION_LENGTH) {
        return EMPTY_SUGGESTIONS;
    }

    const [authors, categories, tags] = await Promise.all([
        getAuthorSuggestions(query),
        getCategorySuggestions(query),
        getTagSuggestions(query),
    ]);

    return {
        authors: toSuggestions(authors, (row) => row.slug, "/author/"),
        categories: toSuggestions(categories, (row) => row.slug, "/category/"),
        tags: toSuggestions(tags, (row) => row.slug, "/tag/"),
    };
};
