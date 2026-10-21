import { db } from "./db";

export const getPageBySlug = (slug: string) =>
    db
        .selectFrom("static_pages")
        .selectAll()
        .where("slug", "=", slug)
        .executeTakeFirst();
