import type { CommentWithUser } from "@/data/comments";

export interface CommentsSectionProps {
    blogId: number;
    initialCount: number;
}

export interface CommentDisplayData extends CommentWithUser {
    displayNumber: number;
}
