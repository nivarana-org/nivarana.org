import { db } from "./db";

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
