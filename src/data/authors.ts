import { asAdmin } from "./authorization";
import { db } from "./db";
import type { Author } from "./models";

export const getAuthorsOverview = () =>
    db
        .selectFrom("authors")
        .select(["id", "name", "path", "email"])
        .orderBy("id", "desc")
        .execute();

export const getAuthor = (id: number) =>
    db
        .selectFrom("authors")
        .select([
            "id",
            "name",
            "path",
            "email",
            "description",
            "title",
            "image",
        ])
        .where("id", "=", id)
        .executeTakeFirst();

export const getAllAuthors = () =>
    db
        .selectFrom("authors")
        .select(["id", "name", "path"])
        .orderBy("id", "desc")
        .execute();

export const addOrEditAuthor = asAdmin(async (author: Author) => {
    const timestamp = new Date(Date.now());
    await db
        .insertInto("authors")
        .values({ ...author, created_at: timestamp, updated_at: timestamp })
        .onDuplicateKeyUpdate({ ...author, updated_at: timestamp })
        .execute();
});
