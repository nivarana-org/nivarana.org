import { db } from "./db";
import { getArticlesByRelation } from "./queries";

export interface Author {
    id?: number;
    name: string;
    email?: string | null;
    slug?: string | null;
    description?: string | null;
    title?: string | null;
    image?: string | null;
}

export const getAllAuthors = () =>
    db
        .selectFrom("authors")
        .select(["id", "name", "slug"])
        .orderBy("id", "desc")
        .execute();

export const getAuthorBySlug = async (slug: string) => {
    const author = await db
        .selectFrom("authors")
        .selectAll()
        .where("slug", "=", slug)
        .executeTakeFirst();
    if (!author) {
        return undefined;
    }
    const articles = await getArticlesByRelation("author", author.id);
    return { ...author, articles };
};
