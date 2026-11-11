export { getPendingCommentsCount, updateCommentStatus } from "@/data/comments";

import { db } from "@/data/db";
import { categoryFragment, type Category } from "@/data/queries";

import type { CommentStatus } from "./_lib/statuses";

/**
 * A row of the admin comments overview: the comment, its author and the post
 * it was left on, with everything needed to link to the post.
 */
export interface CommentOverview {
    id: number;
    blog_id: number;
    contents: string;
    status: CommentStatus | null;
    created_at: Date | null;
    user_name: string;
    user_email: string;
    blog_title: string | null;
    blog_slug: string | null;
    category: Category | null;
}

export const getCommentsOverview = async ({
    status,
    order = "desc",
}: {
    status?: CommentStatus;
    order?: "asc" | "desc";
}): Promise<CommentOverview[]> => {
    let query = db
        .selectFrom("comments as c")
        .innerJoin("user as u", "c.user_id", "u.id")
        .leftJoin("blogs as b", "c.blog_id", "b.id")
        .select([
            "c.id as id",
            "c.blog_id as blog_id",
            "c.contents as contents",
            "c.status as status",
            "c.created_at as created_at",
            "u.name as user_name",
            "u.email as user_email",
            "b.title as blog_title",
            "b.slug as blog_slug",
            categoryFragment.as("category"),
        ]);

    if (status !== undefined) {
        query = query.where("c.status", "=", status);
    }

    const comments = await query
        .orderBy("c.created_at", order)
        .orderBy("c.id", order)
        .execute();

    return comments as CommentOverview[];
};
