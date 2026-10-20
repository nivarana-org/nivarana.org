import { sql, type SqlBool } from "kysely";

import { asAdmin } from "./authorization";
import { db } from "./db";
import { replacePostRelation } from "./post-relations";
import { authorsFragment, categoriesFragment, tagsFragment } from "./queries";

export interface Article {
    id: number;
    path: string;
    total_views: number;
    page_title: string;
    description: string;
    category_name: string;
    authors: number[];
    tags: number[];
    upload_image: string;
    created_at: number;
    updated_at: number;
    meta_title: string;
    meta_keyword: string;
    meta_description: string;
}

export const getArticlesOverview = () =>
    db.selectFrom("blogs").selectAll().orderBy("id", "desc").execute();

const getPublishedPostsPaginated = (
    page: number,
    per_page: number,
    language?: string,
) => {
    return db
        .selectFrom("blogs as b")
        .select([
            "b.id",
            "b.page_title",
            "b.path",
            "b.description",
            "b.upload_image",
            "b.meta_description",
            "b.created_at",
            "b.updated_at",
            "b.type",
            sql<Date>`CASE
                WHEN b.scheduled_time > b.created_at THEN b.scheduled_time
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
            "b.page_title",
            "b.path",
            "b.description",
            "b.upload_image",
            "b.meta_description",
            "b.created_at",
            "b.updated_at",
            "b.type",
            authorsFragment.as("authors"),
            categoriesFragment.as("category"),
            tagsFragment.as("tags"),
        ])
        .where("b.status", "=", "PUBLISHED")
        .where(
            sql<SqlBool>`MATCH(b.page_title, b.description, b.meta_description) AGAINST (${query})`,
        )
        .execute();

export const getArticleFullWithRelations = (id: number) =>
    db
        .selectFrom("blogs as b")
        .select([
            "b.id",
            "b.page_title",
            "b.path",
            "b.description",
            "b.upload_image",
            "b.meta_description",
            "b.created_at",
            "b.updated_at",
            "b.type",
            "b.status",
            "b.scheduled_time",
            "b.language",
            "b.category_name",
            "b.total_views",
            authorsFragment.as("authors"),
            categoriesFragment.as("category"),
            tagsFragment.as("tags"),
        ])
        .where("b.id", "=", id)
        .executeTakeFirst();

export const getAllArticlesAndTags = () =>
    db
        .selectFrom("blogs as b")
        .selectAll()
        .select(tagsFragment.as("tags"))
        .orderBy("b.id", "asc")
        .execute();

export const getPopularPosts = () =>
    db
        .selectFrom("blogs as b")
        .select([
            "b.id",
            "b.page_title",
            "b.path",
            "b.description",
            "b.upload_image",
            "b.meta_description",
            "b.created_at",
            "b.updated_at",
            "b.type",
            authorsFragment.as("authors"),
            categoriesFragment.as("category"),
            tagsFragment.as("tags"),
        ])
        .where("b.status", "=", "PUBLISHED")
        .orderBy("b.total_views", "desc")
        .limit(5)
        .execute();

export const incrementBlogViewCount = async (id: number) => {
    await db
        .updateTable("blogs")
        .set({ total_views: sql<number>`total_views + 1` })
        .where("id", "=", id)
        .executeTakeFirst();
    const row = await db
        .selectFrom("blogs")
        .select("total_views")
        .where("id", "=", id)
        .executeTakeFirst();
    return row?.total_views;
};

export const publishScheduledPostsNeedingPublication = async () => {
    const result = await db
        .updateTable("blogs")
        .set({ status: "PUBLISHED" })
        .where("scheduled_time", "<", new Date())
        .where("status", "!=", "PUBLISHED")
        .executeTakeFirst();
    return Number(result?.numUpdatedOrDeletedRows ?? 0);
};

export const addOrEditPost = asAdmin(async (post: Article) => {
    const timestamp = new Date(Date.now());

    return await db.transaction().execute(async (trx) => {
        // Upsert into blogs table
        const { authors, categories, tags, ...rest } = post;

        const result = await trx
            .insertInto("blogs")
            .values({
                authors: authors.join(","),
                category_name: categories[0],
                ...rest,
                created_at: timestamp,
                updated_at: timestamp,
            })
            .onDuplicateKeyUpdate({ ...rest, updated_at: timestamp })
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
