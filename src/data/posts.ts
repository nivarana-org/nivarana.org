import { sql, type SqlBool } from "kysely";

import { asAdmin } from "./authorization";
import { db } from "./db";
import { replacePostRelation } from "./post-relations";
import { authorsFragment, categoriesFragment, tagsFragment } from "./queries";
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
    categories: number[];
    authors: number[];
    tags: number[];
    image: string;
    created_at?: Date;
    updated_at?: Date;
    intro: string;
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
        .select([tagsFragment.as("tags"), categoriesFragment.as("category")])
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
    category: { id: number; name: string; slug: string }[];
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
            categoriesFragment.as("category"),
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
            categoriesFragment.as("categories"),
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
            categoriesFragment.as("category"),
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
            categoriesFragment.as("category"),
            tagsFragment.as("tags"),
        ])
        .where("b.status", "=", "PUBLISHED")
        .where(
            sql<SqlBool>`MATCH(b.title, b.body_text, b.intro) AGAINST (${query})`,
        )
        .execute();

export const getPopularPosts = () =>
    db
        .selectFrom("blogs as b")
        .select([
            "b.id",
            "b.title",
            "b.slug",
            "b.image",
            "b.intro",
            "b.layout",
            authorsFragment.as("authors"),
            categoriesFragment.as("category"),
            tagsFragment.as("tags"),
        ])
        .where("b.status", "=", "PUBLISHED")
        .orderBy("b.views", "desc")
        .limit(5)
        .execute();

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
        const { authors, categories, tags, ...rest } = post;

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
            .onDuplicateKeyUpdate({ ...values, updated_at: timestamp })
            .executeTakeFirst();

        // On inserts MySQL hands back the auto-generated id; on updates the
        // explicit id we upserted on is the reliable source.
        const postId = Number(post.id) || Number(result.insertId);

        // Replace the post's relations
        await replacePostRelation(postId, "author", authors, trx);
        await replacePostRelation(postId, "category", categories, trx);
        await replacePostRelation(postId, "tag", tags, trx);

        return postId;
    });
});
