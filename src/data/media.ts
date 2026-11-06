import { sql } from "kysely";
import type { Insertable, Selectable } from "kysely";

import type { MediaAuthor } from "@/types/media";

import { asAdmin } from "./authorization";
import { db } from "./db";
import type { DB } from "./db.d";
import { getMediaAuthors, replaceMediaAuthors } from "./media-relations";

export type Media = Selectable<DB["media"]>;
export type MediaType = Media["type"];

export type MediaDetails = Media & {
    authors: MediaAuthor[];
};

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

const groupAuthorsByMedia = (
    rows: Awaited<ReturnType<typeof getMediaAuthors>>,
) => {
    const byMedia = new Map<number, MediaAuthor[]>();
    for (const row of rows) {
        const authors = byMedia.get(row.media_id) ?? [];
        authors.push({
            id: row.id,
            name: row.name,
            slug: row.slug,
        });
        byMedia.set(row.media_id, authors);
    }
    return byMedia;
};

export const getMediaDetails = async (
    type?: MediaType,
): Promise<MediaDetails[]> => {
    const [media, authorRows] = await Promise.all([
        getMedia(type),
        getMediaAuthors(),
    ]);
    const authorsByMedia = groupAuthorsByMedia(authorRows);

    return media.map((item) => ({
        ...item,
        authors: authorsByMedia.get(item.id) ?? [],
    }));
};

export const getMediaDetailsById = async (
    id: number,
): Promise<MediaDetails | undefined> => {
    const [media, authorRows] = await Promise.all([
        getMediaById(id),
        getMediaAuthors(id),
    ]);
    if (!media) {
        return undefined;
    }
    return {
        ...media,
        authors: authorRows.map((row) => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
        })),
    };
};

/**
 * A media item is used when its filename appears in a rendered content field.
 * This is intentionally conservative: false positives protect files from
 * being deleted, while false negatives would break published pages.
 */
export const isMediaUsed = async (mediaId: number) => {
    const result = await sql<{ used: number | string }>`
        SELECT (
            EXISTS (
                SELECT 1
                FROM blogs b
                WHERE b.image = m.filename
                    OR b.contents LIKE CONCAT('%', m.filename, '%')
            )
            OR EXISTS (
                SELECT 1
                FROM authors a
                WHERE a.image = m.filename
                    OR a.description LIKE CONCAT('%', m.filename, '%')
            )
            OR EXISTS (
                SELECT 1
                FROM categories c
                WHERE c.intro LIKE CONCAT('%', m.filename, '%')
            )
            OR EXISTS (
                SELECT 1
                FROM static_pages p
                WHERE p.contents LIKE CONCAT('%', m.filename, '%')
            )
            OR EXISTS (
                SELECT 1
                FROM settings s
                WHERE s.value LIKE CONCAT('%', m.filename, '%')
            )
        ) AS used
        FROM media m
        WHERE m.id = ${mediaId}
    `.execute(db);

    return Boolean(Number(result.rows[0]?.used ?? 0));
};

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

export const updateMediaDetails = asAdmin(
    async (id: number, metadata: MediaMetadata, authorIds?: number[]) => {
        await db.transaction().execute(async (trx) => {
            if (Object.keys(metadata).length > 0) {
                await trx
                    .updateTable("media")
                    .set(metadata)
                    .where("id", "=", id)
                    .executeTakeFirst();
            }

            if (authorIds !== undefined) {
                await replaceMediaAuthors(id, authorIds, trx);
            }
        });

        const updated = await getMediaDetailsById(id);
        if (!updated) {
            throw new Error(`Media ${id} does not exist`);
        }
        return updated;
    },
);

export const deleteMediaRecord = asAdmin(async (id: number) => {
    await db.transaction().execute(async (trx) => {
        await trx
            .deleteFrom("media_relations")
            .where("media_id", "=", id)
            .execute();
        await trx.deleteFrom("media").where("id", "=", id).execute();
    });
});
