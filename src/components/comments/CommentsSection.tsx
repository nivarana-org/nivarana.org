"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { authClient } from "@/utils/auth-client";
import { addComment, getArticleComments } from "@/actions/comments";
import { getUserAbilities } from "@/actions/user";
import type { CommentWithUser } from "@/data/comments";
import type { UserAbility } from "@/actions/user";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { CommentAuthPrompt } from "./CommentAuthPrompt";

interface CommentsSectionProps {
    blogId: number;
    initialCount: number;
}

export default function CommentsSection({
    blogId,
    initialCount,
}: CommentsSectionProps) {
    const pathname = usePathname();
    const session = authClient.useSession();
    const returnUrl = pathname ? `${pathname}#comments` : undefined;
    const [abilities, setAbilities] = useState<UserAbility[]>([]);
    const [abilitiesLoading, setAbilitiesLoading] = useState<boolean | null>(
        null,
    );
    const [isOpen, setIsOpen] = useState(false);
    const [comments, setComments] = useState<CommentWithUser[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [submittingReply, setSubmittingReply] = useState(false);

    useEffect(() => {
        const fetchAbilities = async () => {
            if (session.data) {
                const result = await getUserAbilities();
                if (result.status && result.abilities) {
                    setAbilities(result.abilities);
                }
            } else {
                setAbilities([]);
            }
            setAbilitiesLoading(false);
        };
        fetchAbilities();
    }, [session.data]);

    const canComment = abilities.includes("comment.write");

    const toggleComments = async () => {
        if (!isOpen && comments.length === 0) {
            setLoadingComments(true);
            const result = await getArticleComments(blogId);
            if (result.status && result.data) {
                setComments(result.data);
            }
            setLoadingComments(false);
        }
        setIsOpen(!isOpen);
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return;

        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const result = await addComment(blogId, newComment);

        if (result.status) {
            setNewComment("");
            setSuccess("Comment submitted! It will appear after moderation.");
        } else {
            setError(result.message || "Failed to submit comment");
        }

        setSubmitting(false);
    };

    const handleSubmitReply = async () => {
        if (!replyContent.trim() || replyTo === null) return;

        setSubmittingReply(true);
        setError(null);
        setSuccess(null);

        const result = await addComment(blogId, replyContent, replyTo);

        if (result.status) {
            setReplyContent("");
            setReplyTo(null);
            setSuccess("Reply submitted! It will appear after moderation.");
        } else {
            setError(result.message || "Failed to submit reply");
        }

        setSubmittingReply(false);
    };

    const handleReply = (commentId: number) => {
        setReplyTo(commentId);
        setReplyContent("");
    };

    const cancelReply = () => {
        setReplyTo(null);
        setReplyContent("");
    };

    const scrollToComment = (commentId: number) => {
        const element = document.getElementById(`comment-${commentId}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const getCommentNumber = (commentId: number) => {
        const index = comments.findIndex((c) => c.id === commentId);
        return index + 1;
    };

    const getCommentButtonText = () => {
        if (initialCount === 0) {
            return isOpen ? "Hide comments" : "Add your comment";
        }
        return isOpen
            ? `Hide ${initialCount} comment${initialCount === 1 ? "" : "s"}`
            : `View ${initialCount} comment${initialCount === 1 ? "" : "s"}`;
    };

    return (
        <div className="mt-8 border-t border-nivarana-charcoal pt-6">
            <div className="flex justify-center">
                <button
                    onClick={toggleComments}
                    className="flex items-center gap-2 text-nivarana-blue hover:text-nivarana-green font-bold text-xl transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {getCommentButtonText()}
                </button>
            </div>

            {isOpen && (
                <div className="mt-6 max-w-[65ch] mx-auto">
                    {loadingComments ? (
                        <p className="text-gray-600">Loading comments...</p>
                    ) : (
                        <>
                            {comments.length > 0 && (
                                <div className="space-y-6 mb-8">
                                    {comments.map((comment, index) => (
                                        <CommentItem
                                            key={comment.id}
                                            comment={comment}
                                            displayNumber={index + 1}
                                            getCommentNumber={getCommentNumber}
                                            scrollToComment={scrollToComment}
                                            canReply={canComment}
                                            onReply={handleReply}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                {session.isPending || abilitiesLoading ? (
                                    <p className="text-gray-600">
                                        Checking authentication...
                                    </p>
                                ) : !session.data ? (
                                    <CommentAuthPrompt
                                        isLoggedIn={false}
                                        returnUrl={returnUrl}
                                    />
                                ) : !canComment ? (
                                    <CommentAuthPrompt
                                        isLoggedIn={true}
                                        returnUrl={returnUrl}
                                    />
                                ) : (
                                    <CommentForm
                                        canComment={canComment}
                                        isPending={session.isPending}
                                        isLoggedIn={!!session.data}
                                        userName={session.data.user?.name}
                                        replyTo={replyTo}
                                        replyContent={replyContent}
                                        newComment={newComment}
                                        onNewCommentChange={setNewComment}
                                        onReplyContentChange={setReplyContent}
                                        onSubmitComment={handleSubmitComment}
                                        onSubmitReply={handleSubmitReply}
                                        onCancelReply={cancelReply}
                                        submitting={submitting}
                                        submittingReply={submittingReply}
                                        error={error}
                                        success={success}
                                    />
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
