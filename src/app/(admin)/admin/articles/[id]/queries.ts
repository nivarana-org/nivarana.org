export { getAllAuthors, type Author } from "@/data/authors";
export { getAllCategories } from "@/data/categories";
export { getAllTags } from "@/data/tags";

import { db } from "@/data/db";
import {
    authorsFragment,
    categoryFragment,
    tagsFragment,
} from "@/data/queries";
import type { PostLayout, Story } from "@/data/story";

/**
 * A post as the editor sees it: the row itself plus its relations.
 */
export type EditablePost = {
    id: number;
    title: string | null;
    slug: string | null;
    /** The story document — a parsed object or the raw JSON string. */
    contents: string | Story;
    image: string | null;
    intro: string | null;
    created_at: Date;
    updated_at: Date;
    layout: PostLayout | null;
    status: string | null;
    published_at: Date;
    language: string | null;
    views: number;
    authors: {
        id: number;
        name: string;
        email: string;
        slug: string;
        bio: string;
    }[];
    category: { id: number; name: string; slug: string };
    tags: { id: number; name: string; slug: string }[];
};

/**
 * The date the article was created. Imported media inherits it so the library
 * keeps the same timeline as the article that references the image.
 */
export const getArticleCreatedAt = async (id: number) => {
    const article = await db
        .selectFrom("blogs")
        .select("created_at")
        .where("id", "=", id)
        .executeTakeFirst();

    return article?.created_at;
};

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
            "b.layout",
            "b.status",
            "b.published_at",
            "b.language",
            "b.views",
            authorsFragment.as("authors"),
            categoryFragment.as("category"),
            tagsFragment.as("tags"),
        ])
        .where("b.id", "=", id)
        .executeTakeFirst();
