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
            "b.page_title",
            "b.path",
            "b.description",
            "b.upload_image",
            "b.meta_description",
            "b.created_at",
            "b.updated_at",
            "b.scheduled_time",
            "b.type",
            authorsFragment.as("authors"),
            categoriesFragment.as("category"),
            tagsFragment.as("tags"),
        ])
        .where("b.status", "=", "PUBLISHED")
        .where(
            sql<SqlBool>`MATCH(b.page_title, b.description, b.meta_description) AGAINST (${query})`,
        )
        .execute();
