import { sql, type SqlBool } from "kysely";

/** Queries shorter than this never surface author/category/tag matches. */
export const MIN_SUGGESTION_LENGTH = 2;

/** Maximum entities shown per group (authors, categories, tags). */
export const SUGGESTION_LIMIT = 6;

/**
 * Candidates fetched per group before de-duplication; larger than
 * SUGGESTION_LIMIT because rows sharing a key (duplicated entities)
 * collapse afterwards.
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

/** Keeps matches to entities that actually lead to content. */
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

/**
 * Shapes ranked rows for display: rows without a usable key (nothing to link
 * to) are dropped, rows sharing a key (duplicated entities) collapse into one,
 * and the group is capped at `limit`.
 */
export const toSuggestions = <T extends { name: string }>(
    rows: T[],
    keyOf: (row: T) => string | null,
    hrefPrefix: string,
    limit: number = SUGGESTION_LIMIT,
): Array<{ name: string; href: string }> => {
    const seen = new Set<string>();
    const suggestions: Array<{ name: string; href: string }> = [];

    for (const row of rows) {
        const key = keyOf(row);
        if (!key || seen.has(key)) continue;
        seen.add(key);
        suggestions.push({ name: row.name, href: `${hrefPrefix}${key}` });
        if (suggestions.length >= limit) break;
    }

    return suggestions;
};
