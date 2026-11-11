"use client";

import { useRouter } from "next/navigation";
import { Box, MenuItem, TextField } from "@mui/material";

import {
    COMMENT_STATUSES,
    COMMENT_STATUS_LABELS,
    type CommentStatus,
} from "../_lib/statuses";

export type StatusFilter = "all" | CommentStatus;

type Props = {
    status: StatusFilter;
    order: "asc" | "desc";
};

export default function CommentFilters({ status, order }: Props) {
    const router = useRouter();

    const apply = (next: { status?: StatusFilter; order?: "asc" | "desc" }) => {
        const merged = { status, order, ...next };
        const params = new URLSearchParams();
        if (merged.status !== "all") {
            params.set("status", merged.status);
        }
        if (merged.order !== "desc") {
            params.set("sort", merged.order);
        }
        const query = params.toString();
        router.replace(query ? `/admin/comments?${query}` : "/admin/comments");
    };

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
                select
                size="small"
                label="Status"
                value={status}
                onChange={(event) =>
                    apply({ status: event.target.value as StatusFilter })
                }
                sx={{ minWidth: 160 }}
            >
                <MenuItem value="all">All statuses</MenuItem>
                {COMMENT_STATUSES.map((option) => (
                    <MenuItem key={option} value={option}>
                        {COMMENT_STATUS_LABELS[option]}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                size="small"
                label="Sort by date"
                value={order}
                onChange={(event) =>
                    apply({ order: event.target.value as "asc" | "desc" })
                }
                sx={{ minWidth: 160 }}
            >
                <MenuItem value="desc">Newest first</MenuItem>
                <MenuItem value="asc">Oldest first</MenuItem>
            </TextField>
        </Box>
    );
}
