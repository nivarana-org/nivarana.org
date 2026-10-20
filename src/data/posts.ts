import { asAdmin } from "./authorization";
import { db } from "./db";
import { replacePostRelation } from "./post-relations";
import type { Article } from "./cms";

export const getArticlesOverview = () =>
    db.selectFrom("blogs").selectAll().orderBy("id", "desc").execute();

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
