"use client";

import { useState } from "react";
import { Box } from "@mui/material";

import type { MediaAuthorOption, MediaItem } from "@/types/media";

import MediaDeleteDialog from "./MediaDeleteDialog";
import MediaEditDialog from "./MediaEditDialog";
import MediaGrid from "./MediaGrid";
import MediaUploadButton from "./MediaUploadButton";

type Props = {
    media: MediaItem[];
    authors: MediaAuthorOption[];
    loading?: boolean;
    error?: string | null;
    selectedFilename?: string | null;
    onSelect?: (media: MediaItem) => void;
    onUploaded: (media: MediaItem) => void;
    onUpdated: (media: MediaItem) => void;
    onDeleted: (media: MediaItem) => void;
    accept?: string;
    title?: string;
    uploadLabel?: string;
    emptyMessage?: string;
};

/**
 * The reusable media library surface: upload, browse, select and edit details.
 * A dedicated media page and the picker both use this component.
 */
export default function MediaLibrary({
    media,
    authors,
    loading = false,
    error,
    selectedFilename,
    onSelect,
    onUploaded,
    onUpdated,
    onDeleted,
    accept,
    title,
    uploadLabel = "Upload new media",
    emptyMessage,
}: Props) {
    const [editing, setEditing] = useState<MediaItem | null>(null);
    const [deleting, setDeleting] = useState<MediaItem | null>(null);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minHeight: 0,
                flex: 1,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                {title ? (
                    <Box component="h2" sx={{ m: 0, fontSize: 20 }}>
                        {title}
                    </Box>
                ) : (
                    <span />
                )}
                <MediaUploadButton
                    accept={accept}
                    label={uploadLabel}
                    onUploaded={onUploaded}
                />
            </Box>
            {error ? <Box color="error.main">{error}</Box> : null}
            {loading ? (
                <Box>Loading media...</Box>
            ) : (
                <Box sx={{ overflow: "auto", flex: 1 }}>
                    <MediaGrid
                        media={media}
                        selectedFilename={selectedFilename}
                        onSelect={onSelect}
                        onEdit={(item) => setEditing(item)}
                        onDelete={(item) => setDeleting(item)}
                        emptyMessage={emptyMessage}
                    />
                </Box>
            )}
            <MediaEditDialog
                media={editing}
                authors={authors}
                open={Boolean(editing)}
                onClose={() => setEditing(null)}
                onSaved={onUpdated}
            />
            <MediaDeleteDialog
                media={deleting}
                open={Boolean(deleting)}
                onClose={() => setDeleting(null)}
                onDeleted={onDeleted}
            />
        </Box>
    );
}
