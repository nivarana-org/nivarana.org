export { getActiveSubscriptionByUserId } from "@/data/subscriptions";
export { searchArticles } from "@/data/posts";
export { getArticleBySlug, getPost } from "@/data/queries";
export { getRedirect } from "@/data/redirects";
export { updateCommentStatus } from "@/data/comments";

import { db } from "@/data/db";
import type { MediaAuthor } from "@/types/media";

import type { MediaCreditMap } from "./_lib/mediaCredits";

/**
 * Reads the authors and `credit_text` for every media filename used by a
 * story. Credits are keyed by filename so the renderer can look them up from
 * a chapter image or an `<img>` inside a chapter body.
 */
export async function getMediaCreditsByFilenames(
    filenames: string[],
): Promise<MediaCreditMap> {
    const unique = [
        ...new Set(filenames.filter((filename) => filename.length > 0)),
    ];

    if (unique.length === 0) {
        return {};
    }

    const media = await db
        .selectFrom("media")
        .select(["id", "filename", "credit_text"])
        .where("filename", "in", unique)
        .execute();

    if (media.length === 0) {
        return {};
    }

    const authorRows = await db
        .selectFrom("media_relations as mr")
        .innerJoin("authors as a", "a.id", "mr.relation_id")
        .select(["mr.media_id", "a.id", "a.name", "a.slug"])
        .where("mr.relation_type", "=", "author")
        .where(
            "mr.media_id",
            "in",
            media.map((item) => item.id),
        )
        .orderBy("mr.order", "asc")
        .orderBy("a.name", "asc")
        .execute();

    const authorsByMedia = new Map<number, MediaAuthor[]>();
    for (const row of authorRows) {
        const authors = authorsByMedia.get(row.media_id) ?? [];
        authors.push({
            id: row.id,
            name: row.name,
            slug: row.slug,
        });
        authorsByMedia.set(row.media_id, authors);
    }

    return Object.fromEntries(
        media.map((item) => [
            item.filename,
            {
                authors: authorsByMedia.get(item.id) ?? [],
                creditText: item.credit_text,
            },
        ]),
    );
}

export type CommentStatus = "pending" | "spam" | "accepted" | "hidden";

export interface Comment {
    id: number;
    blog_id: number;
    user_id: string;
    parent_id: number | null;
    contents: string;
    status: CommentStatus;
    created_at: Date | null;
    updated_at: Date | null;
}

export interface CommentWithUser extends Comment {
    user_name: string;
    user_email: string;
}

export async function getCommentsByBlogId(
    blogId: number,
    includePending = false,
): Promise<CommentWithUser[]> {
    let query = db
        .selectFrom("comments")
        .innerJoin("user", "comments.user_id", "user.id")
        .where("comments.blog_id", "=", blogId)
        .where("comments.status", "=", "accepted")
        .orderBy("comments.created_at", "asc")
        .select([
            "comments.id",
            "comments.blog_id",
            "comments.user_id",
            "comments.parent_id",
            "comments.contents",
            "comments.status",
            "comments.created_at",
            "comments.updated_at",
            "user.name as user_name",
            "user.email as user_email",
        ]);

    if (includePending) {
        query = db
            .selectFrom("comments")
            .innerJoin("user", "comments.user_id", "user.id")
            .where("comments.blog_id", "=", blogId)
            .where("comments.status", "in", ["accepted", "pending"])
            .orderBy("comments.created_at", "asc")
            .select([
                "comments.id",
                "comments.blog_id",
                "comments.user_id",
                "comments.parent_id",
                "comments.contents",
                "comments.status",
                "comments.created_at",
                "comments.updated_at",
                "user.name as user_name",
                "user.email as user_email",
            ]);
    }

    const comments = await query.execute();
    return comments as CommentWithUser[];
}

export async function createComment({
    blogId,
    userId,
    contents,
    parentId,
}: {
    blogId: number;
    userId: string;
    contents: string;
    parentId?: number;
}): Promise<Comment> {
    const [comment] = await db
        .insertInto("comments")
        .values({
            blog_id: blogId,
            user_id: userId,
            contents,
            parent_id: parentId ?? null,
            status: "pending",
        })
        .returning([
            "id",
            "blog_id",
            "user_id",
            "parent_id",
            "contents",
            "status",
            "created_at",
            "updated_at",
        ])
        .execute();

    return {
        id: Number(comment.id),
        blog_id: comment.blog_id,
        user_id: comment.user_id,
        parent_id: comment.parent_id ?? null,
        contents: comment.contents,
        status: comment.status as CommentStatus,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
    };
}

export async function getCommentById(id: number): Promise<Comment | null> {
    const [comment] = await db
        .selectFrom("comments")
        .where("id", "=", id)
        .selectAll()
        .execute();

    return (comment as Comment) || null;
}
