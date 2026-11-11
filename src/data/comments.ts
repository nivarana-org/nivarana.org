import { asAdmin } from "./authorization";
import { db } from "./db";
import type { CommentsStatus } from "./db.d";

/**
 * Sets the moderation status of a comment. Admin-only, shared by the admin
 * comments page and the public story pages.
 */
export const updateCommentStatus = asAdmin(
    async ({
        commentId,
        status,
    }: {
        commentId: number;
        status: CommentsStatus;
    }): Promise<void> => {
        await db
            .updateTable("comments")
            .where("id", "=", commentId)
            .set({ status })
            .execute();
    },
);

/**
 * How many comments are waiting for a moderation decision. Powers the
 * notification dot on the admin dashboard and the summary on the comments
 * page.
 */
export const getPendingCommentsCount = async (): Promise<number> => {
    const result = await db
        .selectFrom("comments")
        .where("status", "=", "pending")
        .select((eb) => eb.fn.countAll().as("count"))
        .executeTakeFirst();
    return Number(result?.count ?? 0);
};
