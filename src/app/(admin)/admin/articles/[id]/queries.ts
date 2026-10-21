export { getAllAuthors, type Author } from "@/data/authors";
export { getAllCategories } from "@/data/categories";
export { getAllTags } from "@/data/tags";

import { db } from "@/data/db";
import {
    authorsFragment,
    categoriesFragment,
    tagsFragment,
} from "@/data/queries";

export type { Article } from "@/data/posts";

export const getArticleFullWithRelations = (id: number) =>
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
            "b.status",
            "b.published_at",
            "b.language",
            "b.views",
            authorsFragment.as("authors"),
            categoriesFragment.as("category"),
            tagsFragment.as("tags"),
        ])
        .where("b.id", "=", id)
        .executeTakeFirst();
