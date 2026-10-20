import { db } from "./db";

export const getPagesOverview = () =>
    db.selectFrom("static_pages").selectAll().orderBy("id", "asc").execute();

export const getPage = (id: number) =>
    db
        .selectFrom("static_pages")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();

export const getPageByPath = (path: string) =>
    db
        .selectFrom("static_pages")
        .selectAll()
        .where("page_name", "=", path)
        .executeTakeFirst();
