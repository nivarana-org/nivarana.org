import { sql } from "kysely";

import type { MediaAuthorOption } from "@/types/media";

import { db } from "./db";
import { getArticlesByRelation } from "./queries";

export interface Author {
    id?: number;
    name: string;
    email?: string | null;
    slug?: string | null;
    description?: string | null;
    title?: string | null;
    image?: string | null;
}

export const getAllAuthors = () =>
    db
        .selectFrom("authors")
        .select(["id", "name", "slug"])
        .orderBy("name", "asc")
        .execute();

/**
 * Author options for media metadata. Authors who are already credited on
 * media appear first, most-credited first; the rest are alphabetical.
 */
export const getAuthorOptions = async (): Promise<MediaAuthorOption[]> => {
    const result = await sql<{
        id: number;
        name: string;
        slug: string | null;
        mediaCount: number | string;
    }>`
        SELECT
            a.id,
            a.name,
            a.slug,
            COUNT(m.id) AS mediaCount
        FROM authors a
        LEFT JOIN media_relations mr
            ON mr.relation_id = a.id
            AND mr.relation_type = 'author'
        LEFT JOIN media m
            ON m.id = mr.media_id
            AND m.type = 'image'
        GROUP BY a.id, a.name, a.slug
        ORDER BY mediaCount DESC, a.name ASC
    `.execute(db);

    return result.rows.map((row) => ({
        ...row,
        mediaCount: Number(row.mediaCount),
    }));
};

export const getExistingAuthorIds = async (ids: number[]) => {
    if (ids.length === 0) {
        return [];
    }
    const rows = await db
        .selectFrom("authors")
        .select("id")
        .where("id", "in", ids)
        .execute();
    return rows.map((row) => row.id);
};

export const getAuthorBySlug = async (slug: string) => {
    const author = await db
        .selectFrom("authors")
        .selectAll()
        .where("slug", "=", slug)
        .executeTakeFirst();
    if (!author) {
        return undefined;
    }
    const articles = await getArticlesByRelation("author", author.id);
    return { ...author, articles };
};
