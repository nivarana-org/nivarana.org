import { db } from "./db";
import { getArticlesByRelation } from "./queries";

export const getCategories = async () => {
    return await db
        .selectFrom("categories")
        .where("parent_id", "=", 0)
        .select(["name", "slug"])
        .execute();
};

export const getAllCategories = () =>
    db
        .selectFrom("categories")
        .select(["id", "name"])
        .where("parent_id", "=", 0)
        .orderBy("id", "asc")
        .execute();

export const getCategoryBySlug = async (slug: string) => {
    const category = await db
        .selectFrom("categories")
        .selectAll()
        .where("slug", "=", slug)
        .executeTakeFirst();
    if (!category) {
        return undefined;
    }
    const articles = await getArticlesByRelation("category", category.id);
    return { ...category, articles };
};
