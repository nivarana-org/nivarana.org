import { db } from "@/data/db";
import {
    authorsFragment,
    categoriesFragment,
    tagsFragment,
} from "@/data/queries";
import { sql, SqlBool } from "kysely";

export const searchArticles = (query: string) =>
    db
        .selectFrom("blogs as b")
        .select([
            "b.id",
            "b.title",
            "b.slug",
            "b.contents",
            "b.image",
            "b.intro",
            "b.created_at",
            "b.updated_at",
            "b.type",
            "b.published_at",
            authorsFragment.as("authors"),
            categoriesFragment.as("category"),
            tagsFragment.as("tags"),
        ])
        .where("b.status", "=", "PUBLISHED")
        .where(
            sql<SqlBool>`MATCH(b.title, b.contents, b.intro) AGAINST (${query})`,
        )
        .execute();
