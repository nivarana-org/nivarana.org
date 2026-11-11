import Link from "next/link";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import {
    getCommentsOverview,
    getPendingCommentsCount,
    type CommentOverview,
} from "./queries";
import { isCommentStatus } from "./_lib/statuses";
import CommentFilters from "./_components/CommentFilters";
import CommentStatusSelect from "./_components/CommentStatusSelect";

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const firstParam = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

const formatDate = (date: Date | null) =>
    date
        ? date.toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
          })
        : "";

function CommentRow({ comment }: { comment: CommentOverview }) {
    // A comment without a status has not been moderated yet.
    const status = comment.status ?? "pending";
    const postLink =
        comment.blog_slug == null
            ? null
            : comment.category
              ? `/${comment.category.slug}/${comment.blog_slug}`
              : `/admin/articles/${comment.blog_id}`;
    return (
        <TableRow>
            <TableCell>
                <Typography variant="body2">{comment.user_name}</Typography>
                <Typography variant="caption" color="text.secondary">
                    {comment.user_email}
                </Typography>
            </TableCell>
            <TableCell sx={{ minWidth: 300 }}>
                <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                    {comment.contents}
                </Typography>
            </TableCell>
            <TableCell>
                {postLink ? (
                    <Link href={postLink}>
                        {comment.blog_title ?? `Post #${comment.blog_id}`}
                    </Link>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Deleted post
                    </Typography>
                )}
            </TableCell>
            <TableCell>{formatDate(comment.created_at)}</TableCell>
            <TableCell>
                <CommentStatusSelect commentId={comment.id} status={status} />
            </TableCell>
        </TableRow>
    );
}

export default async function Page({ searchParams }: Props) {
    const params = await searchParams;
    const statusParam = firstParam(params.status);
    const status = isCommentStatus(statusParam) ? statusParam : undefined;
    const order = firstParam(params.sort) === "asc" ? "asc" : "desc";

    const [comments, pendingCount] = await Promise.all([
        getCommentsOverview({ status, order }),
        getPendingCommentsCount(),
    ]);

    return (
        <div className="flex flex-col gap-2 p-2">
            <Box>
                <Typography component="h1" variant="h5">
                    Comments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {comments.length} comment{comments.length === 1 ? "" : "s"}
                    {pendingCount > 0 ? ` · ${pendingCount} pending` : ""}
                </Typography>
            </Box>
            <CommentFilters status={status ?? "all"} order={order} />
            {comments.length === 0 ? (
                <Box
                    sx={{ py: 4, textAlign: "center", color: "text.secondary" }}
                >
                    No comments match this filter.
                </Box>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Author</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>Post</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {comments.map((comment) => (
                            <CommentRow key={comment.id} comment={comment} />
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
