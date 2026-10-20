import { asAdmin } from "./authorization";
import { db } from "./db";

export interface StaticPage {
    id?: number;
    page_name: string;
    page_title: string;
    description: string;
}

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

export const addOrEditPage = asAdmin(async (page: StaticPage) => {
    const timestamp = new Date(Date.now());
    await db
        .insertInto("static_pages")
        .values({
            id: page.id,
            page_name: page.page_name,
            page_title: page.page_title,
            description: page.description,
            created_at: timestamp,
            updated_at: timestamp,
        })
        .onDuplicateKeyUpdate({
            page_name: page.page_name,
            page_title: page.page_title,
            description: page.description,
            updated_at: timestamp,
        })
        .execute();
});
