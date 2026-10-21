import { db } from "@/data/db";

export type { Author } from "@/data/authors";

export const getAuthorsOverview = () =>
    db
        .selectFrom("authors")
        .select(["id", "name", "slug", "email"])
        .orderBy("id", "desc")
        .execute();
