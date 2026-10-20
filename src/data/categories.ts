import { asAdmin } from "./authorization";
import { db } from "./db";
import { getArticlesByRelation } from "./queries";

export const getCategories = async () => {
    return await db
        .selectFrom("categories")
        .where("parent_id", "=", 0)
        .select(["name", "path"])
        .execute();
};

export const getAllCategories = () =>
    db
        .selectFrom("categories")
        .select(["id", "name"])
        .where("parent_id", "=", 0)
        .orderBy("id", "asc")
        .execute();

export const getCategoryByPath = async (path: string) => {
    const category = await db
        .selectFrom("categories")
        .selectAll()
        .where("path", "=", path)
        .executeTakeFirst();
    if (!category) {
        return undefined;
    }
    const articles = await getArticlesByRelation("category", category.id);
    return { ...category, articles };
};

export const addCategory = asAdmin(async (name: string, path: string) => {
    await db
        .insertInto("categories")
        .values({
            name,
            path,
            parent_id: 0,
            meta_title: name,
            meta_keyword: name,
            meta_description: name,
            sort_order: 0,
        })
        .execute();
});
