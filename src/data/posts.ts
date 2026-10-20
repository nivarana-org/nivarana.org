import { sql } from "kysely";

import { asAdmin } from "./authorization";
import { db } from "./db";
import { replacePostRelation } from "./post-relations";
import { authorsFragment, categoriesFragment, tagsFragment } from "./queries";
import type { Article } from "./cms";

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
