import { db } from "./db";
import { getArticlesByRelation } from "./queries";

export const getAllTags = () =>
    db.selectFrom("tags").selectAll().orderBy("id", "asc").execute();

export const getTagByPath = async (path: string) => {
    const tag = await db
        .selectFrom("tags")
        .selectAll()
        .where("path", "=", path)
        .executeTakeFirst();
    if (!tag) {
        return undefined;
    }
    const articles = await getArticlesByRelation("tag", tag.id);
    return { ...tag, articles };
};
