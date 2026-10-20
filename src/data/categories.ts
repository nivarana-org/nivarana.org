import { db } from "./db";

export const getCategories = async () => {
    return await db
        .selectFrom("categories")
        .where("parent_id", "=", 0)
        .select(["name", "path"])
        .execute();
};
