"use client";

import type { CommentWithUser } from "@/data/comments";

interface CommentItemProps {
    comment: CommentWithUser;
    displayNumber: number;
    getCommentNumber: (commentId: number) => number;
    scrollToComment: (commentId: number) => void;
    canReply: boolean;
    onReply: (commentId: number) => void;
}

export function CommentItem({
    comment,
    displayNumber,
    getCommentNumber,
    scrollToComment,
    canReply,
    onReply,
}: CommentItemProps) {
    return (
        <div
            id={`comment-${comment.id}`}
            className="border-b border-gray-200 pb-4"
        >
            <div className="flex justify-between items-start">
                <div>
                    <span className="font-semibold text-nivarana-charcoal">
                        {comment.user_name}
                    </span>
                    {comment.parent_id && (
                        <span className="ml-2 text-sm text-nivarana-blue">
                            in reply to comment #
                            <button
                                onClick={() =>
                                    scrollToComment(comment.parent_id!)
                                }
                                className="hover:underline"
                            >
                                {getCommentNumber(comment.parent_id)}
                            </button>
                        </span>
                    )}
                </div>
                <span className="text-sm text-gray-500">
                    <span className="mr-3 text-nivarana-blue font-medium">
                        #{displayNumber}
                    </span>
                    {comment.created_at
                        ? new Date(comment.created_at).toLocaleDateString(
                              "en-US",
                              {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                              },
                          )
                        : ""}
                </span>
            </div>
            <p className="mt-2 text-nivarana-charcoal whitespace-pre-wrap">
                {comment.content}
            </p>
            {canReply && (
                <button
                    onClick={() => onReply(comment.id)}
                    className="mt-2 text-sm text-nivarana-blue hover:text-nivarana-green"
                >
                    Reply
                </button>
            )}
        </div>
    );
}
