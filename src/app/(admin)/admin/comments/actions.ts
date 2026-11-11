"use server";

import { revalidatePath } from "next/cache";

import { updateCommentStatus } from "./queries";
import type { CommentStatus } from "./_lib/statuses";

export const setCommentStatus = async (
    commentId: number,
    status: CommentStatus,
): Promise<{ status: boolean; message?: string }> => {
    try {
        await updateCommentStatus({ commentId, status });
        revalidatePath("/admin/comments");
        // Story pages show the accepted comment count on the public site.
        revalidatePath("/[type]/[slug]", "page");
        return { status: true };
    } catch (err) {
        console.error(err);
        return {
            status: false,
            message:
                err instanceof Error
                    ? err.message
                    : "The comment status could not be changed",
        };
    }
};
