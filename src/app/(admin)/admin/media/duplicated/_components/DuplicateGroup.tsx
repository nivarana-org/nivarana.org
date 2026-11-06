"use client";

import { useState } from "react";
import Image from "next/image";
import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";

import { deleteMedia } from "@/network/api";
import type { MediaDuplicateGroup, MediaItem } from "@/types/media";

type Props = {
    group: MediaDuplicateGroup;
    onDeleted: (deletedIds: number[]) => void;
};

export default function DuplicateGroup({ group, onDeleted }: Props) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteDuplicates = async () => {
        setDeleting(true);
        setError(null);

        const results = await Promise.allSettled(
            group.duplicates.map((item) => deleteMedia(item.id)),
        );

        const deletedIds: number[] = [];
        const failures: string[] = [];

        results.forEach((result, index) => {
            const item = group.duplicates[index];
            if (result.status === "fulfilled") {
                deletedIds.push(item.id);
                return;
            }

            const message =
                result.reason instanceof Error
                    ? result.reason.message
                    : "The media could not be deleted";
            failures.push(`${item.original_name || item.filename}: ${message}`);
        });

        setDeleting(false);
        if (deletedIds.length > 0) {
            onDeleted(deletedIds);
        }
        if (failures.length > 0) {
            setError(failures.join("\n"));
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        component="h2"
                        variant="subtitle1"
                        title={group.hash}
                    >
                        MD5 {group.hash.slice(0, 12)}...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {group.originals.length} original
                        {group.originals.length === 1 ? "" : "s"},{" "}
                        {group.duplicates.length} duplicate
                        {group.duplicates.length === 1 ? "" : "s"}
                    </Typography>
                </Box>
                <Button
                    color="error"
                    variant="contained"
                    onClick={() => void deleteDuplicates()}
                    disabled={deleting}
                >
                    {deleting
                        ? "Deleting..."
                        : `Delete ${group.duplicates.length} duplicate${
                              group.duplicates.length === 1 ? "" : "s"
                          }`}
                </Button>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                    mt: 2,
                }}
            >
                <Box>
                    <Typography
                        variant="overline"
                        color="text.secondary"
                        component="h3"
                    >
                        Originals
                    </Typography>
                    <Stack spacing={1}>
                        {group.originals.map((item) => (
                            <MediaPreview key={item.id} media={item} />
                        ))}
                    </Stack>
                </Box>

                <Box>
                    <Typography
                        variant="overline"
                        color="text.secondary"
                        component="h3"
                    >
                        Duplicates
                    </Typography>
                    <Stack spacing={1}>
                        {group.duplicates.map((item) => (
                            <MediaPreview key={item.id} media={item} />
                        ))}
                    </Stack>
                    {error ? (
                        <Alert
                            severity="error"
                            sx={{ mt: 1, whiteSpace: "pre-line" }}
                        >
                            {error}
                        </Alert>
                    ) : null}
                </Box>
            </Box>
        </Paper>
    );
}

function MediaPreview({ media }: { media: MediaItem }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 1,
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
                minWidth: 0,
            }}
        >
            {media.type === "image" ? (
                <Image
                    src={media.url}
                    alt={media.alt_text || media.filename}
                    width={80}
                    height={55}
                    style={{ objectFit: "contain", flexShrink: 0 }}
                />
            ) : (
                <Box
                    sx={{
                        width: 80,
                        height: 55,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: "text.secondary",
                    }}
                >
                    {media.type}
                </Box>
            )}
            <Box sx={{ minWidth: 0 }}>
                <Typography
                    variant="body2"
                    title={media.original_name || media.filename}
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {media.original_name || media.filename}
                </Typography>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    title={media.filename}
                    sx={{
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {media.filename}
                </Typography>
                {media.authors.length > 0 ? (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {media.authors.map((author) => author.name).join(", ")}
                    </Typography>
                ) : null}
            </Box>
        </Box>
    );
}
