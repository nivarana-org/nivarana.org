"use client";

import { useState } from "react";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

import { deleteMedia } from "@/network/api";
import type { MediaItem } from "@/types/media";

type Props = {
    media: MediaItem | null;
    open: boolean;
    onClose: () => void;
    onDeleted: (media: MediaItem) => void;
};

export default function MediaDeleteDialog({
    media,
    open,
    onClose,
    onDeleted,
}: Props) {
    if (!open || !media) {
        return null;
    }

    return (
        <MediaDeleteForm
            key={media.id}
            media={media}
            onClose={onClose}
            onDeleted={onDeleted}
        />
    );
}

function MediaDeleteForm({
    media,
    onClose,
    onDeleted,
}: {
    media: MediaItem;
    onClose: () => void;
    onDeleted: (media: MediaItem) => void;
}) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const remove = async () => {
        setDeleting(true);
        setError(null);
        try {
            await deleteMedia(media.id);
            onDeleted(media);
            onClose();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "The media could not be deleted",
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Dialog
            open
            onClose={deleting ? undefined : onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Delete media?</DialogTitle>
            <DialogContent>
                <Typography sx={{ mb: 2 }}>
                    The file will be moved to the uploads trash folder and
                    removed from the media library.
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ wordBreak: "break-all", color: "text.secondary" }}
                >
                    {media.original_name || media.filename}
                </Typography>
                {media.authors.length > 0 ? (
                    <Typography
                        variant="body2"
                        sx={{ mt: 1, color: "text.secondary" }}
                    >
                        Authors:{" "}
                        {media.authors.map((author) => author.name).join(", ")}
                    </Typography>
                ) : null}
                {error ? (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                ) : null}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={deleting}>
                    Cancel
                </Button>
                <Button
                    color="error"
                    onClick={() => void remove()}
                    disabled={deleting}
                >
                    {deleting ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
