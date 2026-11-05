import type { Insertable, Selectable } from "kysely";

import { asAdmin } from "./authorization";
import { db } from "./db";
import type { DB } from "./db.d";

export type Media = Selectable<DB["media"]>;
export type MediaType = Media["type"];

export type NewMedia = Omit<
    Insertable<DB["media"]>,
    "created_at" | "id" | "updated_at"
>;

export type MediaMetadata = {
    alt_text?: string | null;
    created_date?: Date;
};

export const getMedia = (type?: MediaType) => {
    let query = db
        .selectFrom("media")
        .selectAll()
        .orderBy("created_date", "desc")
        .orderBy("id", "desc");

    if (type) {
        query = query.where("type", "=", type);
    }

    return query.execute();
};

export const getMediaById = (id: number) =>
    db.selectFrom("media").selectAll().where("id", "=", id).executeTakeFirst();

export const getMediaByFilename = (filename: string) =>
    db
        .selectFrom("media")
        .selectAll()
        .where("filename", "=", filename)
        .executeTakeFirst();

export const addMedia = asAdmin(async (media: NewMedia) => {
    const result = await db
        .insertInto("media")
        .values(media)
        .executeTakeFirstOrThrow();

    const inserted = await getMediaById(Number(result.insertId));
    if (!inserted) {
        throw new Error("The media record could not be read after insertion");
    }
    return inserted;
});

export const updateMediaMetadata = asAdmin(
    async (id: number, metadata: MediaMetadata) => {
        await db
            .updateTable("media")
            .set(metadata)
            .where("id", "=", id)
            .executeTakeFirst();

        const updated = await getMediaById(id);
        if (!updated) {
            throw new Error(`Media ${id} does not exist`);
        }
        return updated;
    },
);
