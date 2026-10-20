import { Kysely, Transaction } from "kysely";
import { db } from "./db";
import { asAdmin } from "./authorization";
import type { DB } from "./db.d";

const deletePostRelation = (
    post_id: number,
    relation_type: string,
    trx: Transaction<DB> | Kysely<DB>,
) => {
    return trx
        .deleteFrom("post_relations")
        .where("post_id", "=", post_id)
        .where("relation_type", "=", relation_type)
        .executeTakeFirst();
};

const addPostRelation = (
    post_id: number,
    relation_type: string,
    relations: number[],
    trx: Transaction<DB> | Kysely<DB>,
) => {
    return trx
        .insertInto("post_relations")
        .values(
            relations.map((relation_id, index) => ({
                post_id,
                relation_type,
                relation_id,
                order: index + 1,
            })),
        )
        .execute();
};

export const replacePostRelation = async (
    post_id: number,
    relation_type: string,
    relations: number[],
    trx: Transaction<DB> | Kysely<DB>,
) => {
    await deletePostRelation(post_id, relation_type, trx);
    await addPostRelation(post_id, relation_type, relations, trx);
};

export const editPostTags = asAdmin(async (postId: number, tags: number[]) => {
    return db.transaction().execute(async (trx) => {
        return await replacePostRelation(postId, "tag", tags, trx);
    });
});

export const editPostCategory = asAdmin(
    async (postId: number, categoryId: number) => {
        return db.transaction().execute(async (trx) => {
            await trx
                .updateTable("post_relations")
                .set({ relation_id: categoryId })
                .where("post_id", "=", postId)
                .where("relation_type", "=", "category")
                .execute();
            await trx
                .updateTable("blogs")
                .set({ category_name: `${categoryId}` })
                .where("id", "=", postId)
                .execute();
        });
    },
);
