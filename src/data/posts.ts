import { sql } from "kysely";

import { asAdmin } from "./authorization";
import { db } from "./db";
import { replacePostRelation } from "./post-relations";
import {
    authorsFragment,
    categoryFragment,
    fullTextMatch,
    tagsFragment,
    type Category,
} from "./queries";
import {
    parseStory,
    resolveLayout,
    storyBodyText,
    type PostLayout,
} from "./story";

export interface Post {
    id: number;
    slug: string;
    views?: number;
    title: string;
    /** The story document, serialised as JSON. */
    contents: string;
    category: number;
    authors: number[];
    editors: number[];
    tags: number[];
    image: string;
    created_at?: Date;
    updated_at?: Date;
    intro: string;
    /** HTML footnotes shown at the end of the article. */
    footnotes?: string | null;
    status?: string | null;
    language?: string | null;
    /**
     * How the chapters of the story are arranged on the page. When it is not
     * set, the layout is derived from the number of chapters.
     */
    layout?: PostLayout | null;
    /**
     * When the post goes live. It is stamped the first time the post is
     * published and kept from then on.
     */
    published_at?: Date | null;
}

export const getAllArticlesAndTags = () =>
    db
        .selectFrom("blogs as b")
        .select(["b.id", "b.title", "b.slug", "b.image", "b.intro", "b.layout"])
        .select([tagsFragment.as("tags"), categoryFragment.as("category")])
        .orderBy("b.id", "asc")
        .execute();

/**
 * A row of the admin overview: enough to list a post and to link to it.
 */
export type PostOverview = {
    id: number;
    title: string | null;
    slug: string | null;
    image: string | null;
    intro: string | null;
    views: number;
    status: string | null;
    layout: string | null;
    created_at: Date;
    category: { id: number; name: string; slug: string };
};

export const getArticlesOverview = () =>
    db
        .selectFrom("blogs as b")
        .select([
            "b.id",
            "b.title",
            "b.slug",
            "b.image",
            "b.intro",
            "b.views",
            "b.status",
            "b.layout",
            "b.created_at",
            categoryFragment.as("category"),
        ])
        .orderBy("b.id", "desc")
        .execute();

/**
 * The previews shown on the browse grid. Published posts only, with the
 * category needed to build a working public URL.
 */
export const getPublishedPostPreviews = () =>
    db
        .selectFrom("blogs as b")
        .select([
            "b.id",
            "b.title",
            "b.slug",
            "b.image",
            "b.intro",
            "b.created_at",
            categoryFragment.as("category"),
        ])
        .where("b.status", "=", "PUBLISHED")
        .orderBy("b.id", "desc")
        .execute();

const getPublishedPostsPaginated = (
    page: number,
    per_page: number,
    language?: string,
) => {
    return db
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
            "b.layout",
            sql<Date>`CASE
                WHEN b.published_at > b.created_at THEN b.published_at
                ELSE b.created_at
            END`.as("published_time"),
            authorsFragment.as("authors"),
            categoryFragment.as("category"),
            tagsFragment.as("tags"),
        ])
        .where("b.status", "=", "PUBLISHED")
        .$if(!!language, (qb) => qb.where("b.language", "=", language!))
        .orderBy("b.id", "desc")
        .limit(per_page)
        .offset(page * per_page)
        .execute();
};

export const getArticlesPaginated = (page = 0, per_page = 10) =>
    getPublishedPostsPaginated(page, per_page);

export const getArticlesFilteredAndPaginated = (
    page = 0,
    per_page = 10,
    language = "en",
) => getPublishedPostsPaginated(page, per_page, language);

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
            "b.layout",
            authorsFragment.as("authors"),
            categoryFragment.as("category"),
            tagsFragment.as("tags"),
        ])
        .where("b.status", "=", "PUBLISHED")
        .where(fullTextMatch(query))
        .execute();

export type RelatedPost = {
    id: number;
    title: string | null;
    slug: string | null;
    image: string | null;
    category: Category;
};

/**
 * Posts that share the most specific tags with the current post, most similar
 * first.
 *
 * Each shared tag contributes an inverse-document-frequency weight:
 *
 *     ln((publishedPosts + 1) / (postsUsingTag + 1)) + 1
 *
 * A tag used by only a few posts therefore contributes much more than a tag
 * used everywhere, so a rare match can outrank several generic matches.
 */
export const getRelatedPosts = async (
    tagIds: number[],
    excludePostId?: number,
) => {
    if (tagIds.length === 0) return [];

    const result = await sql<RelatedPost>`SELECT
        b.id,
        b.title,
        b.slug,
        b.image,
        ${categoryFragment} AS category
        FROM blogs b
        JOIN (
            SELECT
                pr.post_id,
                SUM(
                    LN(
                        (totals.posts + 1) / (tag_usage.post_count + 1)
                    ) + 1
                ) AS score,
                COUNT(DISTINCT pr.relation_id) AS shared_tags
            FROM post_relations pr
            JOIN (
                SELECT
                    pr2.relation_id,
                    COUNT(DISTINCT pr2.post_id) AS post_count
                FROM post_relations pr2
                JOIN blogs b2 ON b2.id = pr2.post_id
                WHERE pr2.relation_type = 'tag'
                    AND b2.status = 'PUBLISHED'
                    AND pr2.relation_id IN (${sql.join(tagIds)})
                GROUP BY pr2.relation_id
            ) tag_usage ON tag_usage.relation_id = pr.relation_id
            CROSS JOIN (
                SELECT COUNT(*) AS posts
                FROM blogs
                WHERE status = 'PUBLISHED'
            ) totals
            WHERE pr.relation_type = 'tag'
                AND pr.relation_id IN (${sql.join(tagIds)})
            GROUP BY pr.post_id
        ) matches ON matches.post_id = b.id
        WHERE b.status = 'PUBLISHED'
            ${excludePostId ? sql`AND b.id != ${excludePostId}` : sql``}
        ORDER BY matches.score DESC, matches.shared_tags DESC, b.views DESC
        LIMIT 5
    ;`.execute(db);

    return result.rows;
};

export const incrementBlogViewCount = async (id: number) => {
    await db
        .updateTable("blogs")
        .set({ views: sql<number>`views + 1` })
        .where("id", "=", id)
        .executeTakeFirst();
    const row = await db
        .selectFrom("blogs")
        .select("views")
        .where("id", "=", id)
        .executeTakeFirst();
    return row?.views;
};

export const addOrEditPost = asAdmin(async (post: Post) => {
    const timestamp = new Date(Date.now());

    const chapters = parseStory(post.contents).chapters;
    const layout = resolveLayout(chapters.length, post.layout);
    const bodyText = storyBodyText(chapters);

    return await db.transaction().execute(async (trx) => {
        // Upsert into blogs table
        const { authors, editors, category, tags, ...rest } = post;

        // The publication date is stamped the first time the post goes live
        // and kept from then on, so editing a published post does not move
        // it. A post that is scheduled for later keeps the date it was given.
        const existing = await trx
            .selectFrom("blogs")
            .select(["status", "published_at"])
            .where("id", "=", post.id)
            .executeTakeFirst();
        const publishedAt =
            post.published_at ??
            (existing?.status === "PUBLISHED"
                ? existing.published_at
                : timestamp);

        const values = {
            ...rest,
            published_at: publishedAt,
            layout,
            body_text: bodyText,
            created_at: timestamp,
            updated_at: timestamp,
        };

        const result = await trx
            .insertInto("blogs")
            .values(values)
            .onConflict((oc) =>
                oc
                    .column("id")
                    .doUpdateSet({ ...values, updated_at: timestamp }),
            )
            .returning("id")
            .executeTakeFirstOrThrow();

        // RETURNING hands back the row's id on both branches of the upsert.
        const postId = Number(result.id);

        // Replace the post's relations
        await replacePostRelation(postId, "author", authors, trx);
        await replacePostRelation(postId, "editor", editors, trx);
        await replacePostRelation(postId, "category", [category], trx);
        await replacePostRelation(postId, "tag", tags, trx);

        return postId;
    });
});
