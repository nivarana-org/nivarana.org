import { sql } from "kysely";

import { db } from "@/data/db";

export type AuthorWithArticleCount = {
    id: number;
    name: string;
    slug: string;
    article_count: number;
};

/**
 * Published authors in alphabetical order, together with the number of
 * published articles they have written.
 */
export const getAuthorsWithPublishedArticleCounts = async () => {
    const rows = await db
        .selectFrom("authors as a")
        .innerJoin("post_relations as pr", (join) =>
            join
                .onRef("pr.relation_id", "=", "a.id")
                .on("pr.relation_type", "=", "author"),
        )
        .innerJoin("blogs as b", (join) =>
            join
                .onRef("b.id", "=", "pr.post_id")
                .on("b.status", "=", "PUBLISHED"),
        )
        .select(["a.id", "a.name", "a.slug"])
        .select(sql<number>`COUNT(DISTINCT b.id)`.as("article_count"))
        .where("a.slug", "is not", null)
        .groupBy(["a.id", "a.name", "a.slug"])
        .orderBy("a.name", "asc")
        .execute();

    return rows.map((row): AuthorWithArticleCount => ({
        id: row.id,
        name: row.name,
        slug: row.slug as string,
        article_count: Number(row.article_count),
    }));
};
