"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, MenuItem, TextField, Typography } from "@mui/material";

import { setCommentStatus } from "../actions";
import {
    COMMENT_STATUSES,
    COMMENT_STATUS_LABELS,
    type CommentStatus,
} from "../_lib/statuses";

type Props = {
    commentId: number;
    status: CommentStatus;
};

export default function CommentStatusSelect({ commentId, status }: Props) {
    const router = useRouter();
    const [value, setValue] = useState<CommentStatus>(status);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const change = async (next: CommentStatus) => {
        if (next === value || saving) {
            return;
        }
        const previous = value;
        setValue(next);
        setSaving(true);
        setError(null);
        const result = await setCommentStatus(commentId, next);
        setSaving(false);
        if (result.status) {
            // The action revalidates the page; refresh so the updated list
            // (for example rows leaving the active status filter) renders.
            router.refresh();
        } else {
            setValue(previous);
            setError(result.message ?? "The status could not be changed");
        }
    };

    return (
        <Box>
            <TextField
                select
                size="small"
                value={value}
                disabled={saving}
                onChange={(event) =>
                    void change(event.target.value as CommentStatus)
                }
                sx={{ minWidth: 130 }}
            >
                {COMMENT_STATUSES.map((option) => (
                    <MenuItem key={option} value={option}>
                        {COMMENT_STATUS_LABELS[option]}
                    </MenuItem>
                ))}
            </TextField>
            {error ? (
                <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: "block" }}
                >
                    {error}
                </Typography>
            ) : null}
        </Box>
    );
}
