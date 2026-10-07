import { db } from "./db";

export const getRedirect = (path: string) =>
    db
        .selectFrom("redirects")
        .where("source", "=", path)
        .selectAll()
        .executeTakeFirst();
