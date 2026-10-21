import { asAdmin } from "./authorization";
import { db } from "./db";
import { getArticlesByRelation } from "./queries";

export const getAllTags = () =>
    db.selectFrom("tags").selectAll().orderBy("name", "asc").execute();

export const addTag = asAdmin(async (name: string, slug: string) => {
    const existing = await db
        .selectFrom("tags")
        .select("id")
        .where("slug", "=", slug)
        .executeTakeFirst();
    if (existing) {
        return {
            status: false as const,
            message: "A tag with this slug already exists",
        };
    }
    const result = await db
        .insertInto("tags")
        .values({ name, slug })
        .executeTakeFirst();
    return {
        status: true as const,
        data: { id: Number(result.insertId), name },
    };
});

export const getTagBySlug = async (slug: string) => {
    const tag = await db
        .selectFrom("tags")
        .selectAll()
        .where("slug", "=", slug)
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
            "t.slug as slug",
            eb.fn.countAll().as("count"),
        ])
        .where("pr.relation_type", "=", "tag")
        .where("b.status", "=", "PUBLISHED")
        .groupBy(["t.id", "t.name", "t.slug"])
        .orderBy((eb) => eb.fn.countAll(), "desc")
        .limit(100)
        .execute();
    return rows.map((row) => ({ ...row, count: Number(row.count) }));
};
