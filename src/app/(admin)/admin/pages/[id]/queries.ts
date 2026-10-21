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
    slug: string;
    title: string;
    contents: string;
}

export const addOrEditPage = asAdmin(async (page: StaticPage) => {
    const timestamp = new Date(Date.now());
    await db
        .insertInto("static_pages")
        .values({
            id: page.id,
            slug: page.slug,
            title: page.title,
            contents: page.contents,
            created_at: timestamp,
            updated_at: timestamp,
        })
        .onDuplicateKeyUpdate({
            slug: page.slug,
            title: page.title,
            contents: page.contents,
            updated_at: timestamp,
        })
        .execute();
});
