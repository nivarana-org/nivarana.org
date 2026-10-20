import { db } from "./db";

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
