import { db } from "./db";
import { getArticlesByRelation } from "./queries";

export interface Author {
    id?: number | string | null;
    name: string;
    email?: string | null;
    path?: string | null;
    description?: string | null;
    title?: string | null;
    image?: string | null;
}

export const getAllAuthors = () =>
    db
        .selectFrom("authors")
        .select(["id", "name", "path"])
        .orderBy("id", "desc")
        .execute();

export const getAuthorByPath = async (path: string) => {
    const author = await db
        .selectFrom("authors")
        .selectAll()
        .where("path", "=", path)
        .executeTakeFirst();
    if (!author) {
        return undefined;
    }
    const articles = await getArticlesByRelation("author", author.id);
    return { ...author, articles };
};
