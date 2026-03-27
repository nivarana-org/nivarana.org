import { db } from "./db";

export type CommentStatus = "pending" | "spam" | "accepted" | "hidden";

export interface Comment {
    id: number;
    blog_id: number;
    user_id: string;
    parent_id: number | null;
    content: string;
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
            "comments.content",
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
                "comments.content",
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

export async function getAcceptedCommentCountByBlogId(
    blogId: number,
): Promise<number> {
    const [result] = await db
        .selectFrom("comments")
        .where("blog_id", "=", blogId)
        .where("status", "=", "accepted")
        .select((eb) => eb.fn.count<number>("id").as("count"))
        .execute();

    return Number(result?.count) ?? 0;
}

export async function createComment({
    blogId,
    userId,
    content,
    parentId,
}: {
    blogId: number;
    userId: string;
    content: string;
    parentId?: number;
}): Promise<Comment> {
    const [comment] = await db
        .insertInto("comments")
        .values({
            blog_id: blogId,
            user_id: userId,
            content,
            parent_id: parentId ?? null,
            status: "pending",
        })
        .returning([
            "id",
            "blog_id",
            "user_id",
            "parent_id",
            "content",
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
        content: comment.content,
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

export async function updateCommentStatus({
    commentId,
    status,
}: {
    commentId: number;
    status: CommentStatus;
}): Promise<void> {
    await db
        .updateTable("comments")
        .where("id", "=", commentId)
        .set({ status })
        .execute();
}
