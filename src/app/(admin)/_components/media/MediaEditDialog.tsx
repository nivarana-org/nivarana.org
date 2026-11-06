"use client";

import { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment";
import type { Moment } from "moment";

import { updateMedia } from "@/network/api";
import type { MediaAuthorOption, MediaItem } from "@/types/media";
import RichTextEditor from "@/app/(admin)/admin/_components/RichTextEditor";

import MediaAuthorSelect from "./MediaAuthorSelect";

type Props = {
    media: MediaItem | null;
    authors: MediaAuthorOption[];
    open: boolean;
    onClose: () => void;
    onSaved: (media: MediaItem) => void;
};

export default function MediaEditDialog({
    media,
    authors,
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
            authors={authors}
            onClose={onClose}
            onSaved={onSaved}
        />
    );
}

function MediaEditForm({
    media,
    authors,
    onClose,
    onSaved,
}: {
    media: MediaItem;
    authors: MediaAuthorOption[];
    onClose: () => void;
    onSaved: (media: MediaItem) => void;
}) {
    const [altText, setAltText] = useState(media.alt_text ?? "");
    const [creditText, setCreditText] = useState(media.credit_text ?? "");
    const [authorIds, setAuthorIds] = useState<number[]>(
        media.authors.map((author) => author.id),
    );
    const [createdDate, setCreatedDate] = useState<Moment | null>(
        moment(media.created_date),
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const save = async () => {
        if (!createdDate) {
            setError("Date of creation is required.");
            return;
        }

        setSaving(true);
        setError(null);
        try {
            const updated = await updateMedia(media.id, {
                alt_text: altText.trim() || null,
                credit_text: creditText.trim() || null,
                created_date: createdDate.toISOString(),
                author_ids: authorIds,
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
            maxWidth="md"
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
                <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography
                        component="div"
                        variant="body2"
                        sx={{ fontWeight: 600, mb: 1 }}
                    >
                        Credit text
                    </Typography>
                    <RichTextEditor
                        value={creditText}
                        onChange={setCreditText}
                        height={240}
                    />
                </Box>
                <DateTimePicker
                    label="Date of creation"
                    value={createdDate}
                    onChange={(value) => setCreatedDate(value)}
                    slotProps={{
                        textField: { fullWidth: true, margin: "normal" },
                    }}
                />
                <Box sx={{ mt: 2 }}>
                    <MediaAuthorSelect
                        authors={authors}
                        value={authorIds}
                        onChange={setAuthorIds}
                        helperText="Search by name. Frequently credited authors are listed first."
                    />
                </Box>
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
