export const COMMENT_STATUSES = [
    "pending",
    "accepted",
    "hidden",
    "spam",
] as const;

export type CommentStatus = (typeof COMMENT_STATUSES)[number];

export const COMMENT_STATUS_LABELS: Record<CommentStatus, string> = {
    pending: "Pending",
    accepted: "Accepted",
    hidden: "Hidden",
    spam: "Spam",
};

export const isCommentStatus = (value: unknown): value is CommentStatus =>
    typeof value === "string" &&
    (COMMENT_STATUSES as readonly string[]).includes(value);
