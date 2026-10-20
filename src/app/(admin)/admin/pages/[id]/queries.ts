import { asAdmin } from "@/data/authorization";
import { db } from "@/data/db";

export const getPage = (id: number) =>
    db
        .selectFrom("static_pages")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();

export interface StaticPage {
    id?: number;
    page_name: string;
    page_title: string;
    description: string;
}

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
