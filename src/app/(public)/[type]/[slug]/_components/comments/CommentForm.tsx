"use client";

import Link from "next/link";

interface CommentFormProps {
    canComment: boolean;
    isPending: boolean;
    isLoggedIn: boolean;
    userName?: string;
    replyTo: number | null;
    replyContent: string;
    newComment: string;
    onNewCommentChange: (value: string) => void;
    onReplyContentChange: (value: string) => void;
    onSubmitComment: () => void;
    onSubmitReply: () => void;
    onCancelReply: () => void;
    submitting: boolean;
    submittingReply: boolean;
    error: string | null;
    success: string | null;
}

export function CommentForm({
    canComment,
    isPending,
    isLoggedIn,
    userName,
    replyTo,
    replyContent,
    newComment,
    onNewCommentChange,
    onReplyContentChange,
    onSubmitComment,
    onSubmitReply,
    onCancelReply,
    submitting,
    submittingReply,
    error,
    success,
}: CommentFormProps) {
    if (isPending) {
        return <p className="text-gray-600">Checking authentication...</p>;
    }

    if (!isLoggedIn) {
        return (
            <div className="text-center py-4">
                <p className="text-nivarana-charcoal font-medium">
                    Become a member to add comments
                </p>
                <p className="text-sm text-gray-600 mt-1">
                    Already a member?{" "}
                    <Link
                        href="/sign-in"
                        className="text-nivarana-blue hover:text-nivarana-green underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        );
    }

    if (!canComment) {
        return (
            <div className="text-center py-4">
                <p className="text-nivarana-charcoal font-medium">
                    Become a member to add comments
                </p>
                <p className="text-sm text-gray-600 mt-1">
                    Get access to comment on articles.{" "}
                    <Link
                        href="/profile#membership"
                        className="text-nivarana-blue hover:text-nivarana-green underline"
                    >
                        Subscribe now
                    </Link>
                </p>
            </div>
        );
    }

    return (
        <div>
            <p className="mb-2 text-sm text-gray-600">
                Logged in as {userName}
            </p>

            {replyTo !== null && (
                <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-blue-800">
                            Replying to comment #{replyTo}
                        </span>
                        <button
                            onClick={onCancelReply}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Cancel
                        </button>
                    </div>
                    <textarea
                        value={replyContent}
                        onChange={(e) => onReplyContentChange(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full p-2 border border-gray-300 rounded resize-none h-24"
                        maxLength={4096}
                    />
                    <button
                        onClick={onSubmitReply}
                        disabled={submittingReply || !replyContent.trim()}
                        className="mt-2 px-4 py-2 bg-nivarana-blue text-white rounded hover:bg-nivarana-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {submittingReply ? "Submitting..." : "Submit Reply"}
                    </button>
                </div>
            )}

            {replyTo === null && (
                <>
                    <textarea
                        value={newComment}
                        onChange={(e) => onNewCommentChange(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full p-2 border border-gray-300 rounded resize-none h-24"
                        maxLength={4096}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                            Comments will be moderated
                        </span>
                        <button
                            onClick={onSubmitComment}
                            disabled={submitting || !newComment.trim()}
                            className="px-4 py-2 bg-nivarana-blue text-white rounded hover:bg-nivarana-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {submitting ? "Submitting..." : "Submit Comment"}
                        </button>
                    </div>
                </>
            )}

            {error && <p className="mt-2 text-red-600">{error}</p>}
            {success && <p className="mt-2 text-green-600">{success}</p>}
        </div>
    );
}
