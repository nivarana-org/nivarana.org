import { db } from "./db";
import { groupOrderAndSelect } from "./utils";

export const getArticleByPath = async (path: string) => {
    const article = await db
        .selectFrom("blogs")
        .where("path", "=", path)
        .selectAll()
        .executeTakeFirst();
    if (article) {
        const relationsRows = await db
            .selectFrom("post_relations")
            .where("post_id", "=", article.id)
            .selectAll()
            .execute();
        const relations = groupOrderAndSelect(
            relationsRows,
            "relation_type",
            "order",
            "relation_id",
        );
        return { article, relations };
    }
};
