"use server";

import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { getActiveSubscriptionByUserId } from "@/data/subscriptions";
import {
    createComment,
    getCommentsByBlogId,
    getAcceptedCommentCountByBlogId,
    type CommentWithUser,
} from "@/data/comments";

const MAX_COMMENT_LENGTH = 4096;

export async function addComment(
    blogId: number,
    content: string,
    parentId?: number,
): Promise<{
    status: boolean;
    message?: string;
    data?: CommentWithUser;
}> {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
        return { status: false, message: "Not authenticated" };
    }

    const subscription = await getActiveSubscriptionByUserId(session.user.id);

    if (!subscription || subscription.status !== "active") {
        return {
            status: false,
            message: "Active membership required to comment",
        };
    }

    if (!content || content.trim().length === 0) {
        return { status: false, message: "Comment cannot be empty" };
    }

    if (content.length > MAX_COMMENT_LENGTH) {
        return {
            status: false,
            message: `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters`,
        };
    }

    if (parentId !== undefined && parentId !== null && parentId <= 0) {
        return { status: false, message: "Invalid parent comment" };
    }

    try {
        const comment = await createComment({
            blogId,
            userId: session.user.id,
            content: content.trim(),
            parentId,
        });

        const comments = await getCommentsByBlogId(blogId);
        const newComment = comments.find((c) => c.id === comment.id);

        return { status: true, data: newComment };
    } catch (err) {
        console.error("Error creating comment:", err);
        return { status: false, message: "Failed to create comment" };
    }
}

export async function getArticleComments(
    blogId: number,
): Promise<{
    status: boolean;
    data?: CommentWithUser[];
    count?: number;
    message?: string;
}> {
    try {
        const comments = await getCommentsByBlogId(blogId);
        const count = await getAcceptedCommentCountByBlogId(blogId);
        return { status: true, data: comments, count };
    } catch (err) {
        console.error("Error fetching comments:", err);
        return { status: false, message: "Failed to fetch comments" };
    }
}

export async function getCommentCount(blogId: number): Promise<number> {
    return getAcceptedCommentCountByBlogId(blogId);
}
