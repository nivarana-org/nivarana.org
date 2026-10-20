import { db } from "@/data/db";

export type { Author } from "@/data/authors";

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

export const addOrEditAuthor = (author: {
    id?: number | string | null;
    name: string;
    email?: string | null;
    path?: string | null;
    description?: string | null;
    title?: string | null;
    image?: string | null;
}) => {
    const timestamp = new Date(Date.now());
    return db
        .insertInto("authors")
        .values({ ...author, created_at: timestamp, updated_at: timestamp })
        .onDuplicateKeyUpdate({ ...author, updated_at: timestamp })
        .execute();
};
