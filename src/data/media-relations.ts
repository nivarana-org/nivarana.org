import type { Kysely, Transaction } from "kysely";

import type { MediaAuthor } from "@/types/media";

import { db } from "./db";
import type { DB } from "./db.d";

export type MediaAuthorRow = MediaAuthor & {
    media_id: number;
};

export const getMediaAuthors = async (mediaId?: number) => {
    let query = db
        .selectFrom("media_relations as mr")
        .innerJoin("authors as a", "a.id", "mr.relation_id")
        .select(["mr.media_id", "a.id", "a.name", "a.slug"])
        .where("mr.relation_type", "=", "author")
        .orderBy("mr.order", "asc")
        .orderBy("a.name", "asc");

    if (mediaId !== undefined) {
        query = query.where("mr.media_id", "=", mediaId);
    }

    return query.execute();
};

export const replaceMediaAuthors = async (
    mediaId: number,
    authorIds: number[],
    trx: Transaction<DB> | Kysely<DB>,
) => {
    await trx
        .deleteFrom("media_relations")
        .where("media_id", "=", mediaId)
        .where("relation_type", "=", "author")
        .execute();

    const uniqueAuthorIds = [...new Set(authorIds)];
    if (uniqueAuthorIds.length === 0) {
        return;
    }

    await trx
        .insertInto("media_relations")
        .values(
            uniqueAuthorIds.map((relationId, index) => ({
                media_id: mediaId,
                relation_type: "author",
                relation_id: relationId,
                order: index + 1,
            })),
        )
        .execute();
};
