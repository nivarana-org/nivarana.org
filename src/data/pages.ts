import { db } from "./db";

export const getPageByPath = (path: string) =>
    db
        .selectFrom("static_pages")
        .selectAll()
        .where("page_name", "=", path)
        .executeTakeFirst();
