import { sql, type SqlBool } from "kysely";

import type { Suggestion } from "@/types/nivarana";

/** Queries shorter than this never produce author/category/tag suggestions. */
export const MIN_SUGGESTION_LENGTH = 2;

/** Maximum suggestions returned per group (authors, categories, tags). */
export const SUGGESTION_LIMIT = 4;

/**
 * Candidates fetched per group before de-duplication; larger than
 * SUGGESTION_LIMIT because duplicate rows (same path, different ids)
 * are collapsed afterwards.
 */
export const SUGGESTION_CANDIDATE_LIMIT = 20;

export const normalizeQuery = (query: string) => query.trim().toLowerCase();

/**
 * Escapes LIKE metacharacters so a user query is matched literally.
 * MySQL treats a backslash as the default LIKE escape character.
 */
export const escapeLike = (value: string) =>
    value
        .replaceAll("\\", "\\\\")
        .replaceAll("%", "\\%")
        .replaceAll("_", "\\_");

const patterns = (query: string) => ({
    prefix: `${escapeLike(query)}%`,
    wordPrefix: `% ${escapeLike(query)}%`,
});

/**
 * "Matches very well": the name equals the query, starts with it, or contains
 * a word that starts with it. Wrapped in parentheses so that combining it with
 * other `.where()` clauses keeps OR from binding looser than AND.
 */
export const suggestionMatchCondition = (column: string, query: string) => {
    const { prefix, wordPrefix } = patterns(query);
    return sql<SqlBool>`(
        LOWER(${sql.ref(column)}) = ${query}
        OR LOWER(${sql.ref(column)}) LIKE ${prefix}
        OR LOWER(${sql.ref(column)}) LIKE ${wordPrefix}
    )`;
};

/** Same three tiers as `suggestionMatchCondition`, as a sort key: exact < prefix < word. */
export const suggestionRank = (column: string, query: string) => {
    const { prefix } = patterns(query);
    return sql<number>`CASE
        WHEN LOWER(${sql.ref(column)}) = ${query} THEN 0
        WHEN LOWER(${sql.ref(column)}) LIKE ${prefix} THEN 1
        ELSE 2
    END`;
};

/** Keeps suggestions to entities that actually lead to content. */
export const hasPublishedPost = (
    relationType: string,
    relationIdColumn: string,
) =>
    sql<SqlBool>`EXISTS (
        SELECT 1
        FROM post_relations pr
        JOIN blogs pb ON pb.id = pr.post_id
        WHERE pr.relation_type = ${relationType}
            AND pr.relation_id = ${sql.ref(relationIdColumn)}
            AND pb.status = 'PUBLISHED'
    )`;

type MatchedRow = { name: string; path: string | null };

/**
 * Shapes ranked rows for the client: rows without a path are dropped, rows
 * sharing a path (duplicated entities) collapse into one, and the group is
 * capped at SUGGESTION_LIMIT.
 */
export const toSuggestions = (
    rows: MatchedRow[],
    hrefPrefix: string,
): Suggestion[] => {
    const seen = new Set<string>();
    const suggestions: Suggestion[] = [];

    for (const row of rows) {
        if (!row.path || seen.has(row.path)) continue;
        seen.add(row.path);
        suggestions.push({
            name: row.name,
            path: row.path,
            href: `${hrefPrefix}${row.path}`,
        });
        if (suggestions.length >= SUGGESTION_LIMIT) break;
    }

    return suggestions;
};
