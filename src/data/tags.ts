import { asAdmin } from "./authorization";
import { db } from "./db";
import { getArticlesByRelation } from "./queries";

export const getAllTags = () =>
    db.selectFrom("tags").selectAll().orderBy("name", "asc").execute();

export const addTag = asAdmin(async (name: string, path: string) => {
    const existing = await db
        .selectFrom("tags")
        .select("id")
        .where("path", "=", path)
        .executeTakeFirst();
    if (existing) {
        return {
            status: false as const,
            message: "A tag with this path already exists",
        };
    }
    const result = await db
        .insertInto("tags")
        .values({ name, path })
        .executeTakeFirst();
    return {
        status: true as const,
        data: { id: Number(result.insertId), name },
    };
});

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

export const getTagCloud = async () => {
    const rows = await db
        .selectFrom("tags as t")
        .innerJoin("post_relations as pr", "pr.relation_id", "t.id")
        .innerJoin("blogs as b", "b.id", "pr.post_id")
        .select((eb) => [
            "t.name as value",
            "t.path as path",
            eb.fn.countAll().as("count"),
        ])
        .where("pr.relation_type", "=", "tag")
        .where("b.status", "=", "PUBLISHED")
        .groupBy(["t.id", "t.name", "t.path"])
        .orderBy((eb) => eb.fn.countAll(), "desc")
        .limit(100)
        .execute();
    return rows.map((row) => ({ ...row, count: Number(row.count) }));
};
