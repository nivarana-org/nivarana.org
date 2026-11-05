"use client";

import { useState } from "react";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment";
import type { Moment } from "moment";

import { updateMedia } from "@/network/api";
import type { MediaItem } from "@/types/media";

type Props = {
    media: MediaItem | null;
    open: boolean;
    onClose: () => void;
    onSaved: (media: MediaItem) => void;
};

export default function MediaEditDialog({
    media,
    open,
    onClose,
    onSaved,
}: Props) {
    if (!open || !media) {
        return null;
    }

    return (
        <MediaEditForm
            key={media.id}
            media={media}
            onClose={onClose}
            onSaved={onSaved}
        />
    );
}

function MediaEditForm({
    media,
    onClose,
    onSaved,
}: {
    media: MediaItem;
    onClose: () => void;
    onSaved: (media: MediaItem) => void;
}) {
    const [altText, setAltText] = useState(media.alt_text ?? "");
    const [createdDate, setCreatedDate] = useState<Moment | null>(
        moment(media.created_date),
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const save = async () => {
        setSaving(true);
        setError(null);
        try {
            const updated = await updateMedia(media.id, {
                alt_text: altText.trim() || null,
                created_date: createdDate?.toISOString(),
            });
            onSaved(updated);
            onClose();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "The media details could not be saved",
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open
            onClose={saving ? undefined : onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Media details</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Alt text"
                    value={altText}
                    onChange={(event) => setAltText(event.target.value)}
                    helperText="Describe the image for screen readers and search engines"
                    slotProps={{ htmlInput: { maxLength: 2000 } }}
                />
                <DateTimePicker
                    label="Date of creation"
                    value={createdDate}
                    onChange={(value) => setCreatedDate(value)}
                    slotProps={{
                        textField: { fullWidth: true, margin: "normal" },
                    }}
                />
                <div className="text-xs text-gray-500 break-all">
                    {media.filename}
                </div>
                {error ? (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                ) : null}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>
                    Cancel
                </Button>
                <Button onClick={() => void save()} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
