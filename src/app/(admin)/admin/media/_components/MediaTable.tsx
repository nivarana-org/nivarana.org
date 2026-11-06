"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import moment from "moment";
import type { Moment } from "moment";

import { updateMedia } from "@/network/api";
import type { MediaAuthorOption, MediaItem } from "@/types/media";

import MediaAuthorSelect from "@/app/(admin)/_components/media/MediaAuthorSelect";
import MediaDeleteDialog from "@/app/(admin)/_components/media/MediaDeleteDialog";

type Props = {
    media: MediaItem[];
    authors: MediaAuthorOption[];
    onUpdated: (media: MediaItem) => void;
    onDeleted: (media: MediaItem) => void;
};

export default function MediaTable({
    media,
    authors,
    onUpdated,
    onDeleted,
}: Props) {
    const [deleting, setDeleting] = useState<MediaItem | null>(null);

    if (media.length === 0) {
        return (
            <Box sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
                No media matches these filters.
            </Box>
        );
    }

    return (
        <>
            <TableContainer sx={{ maxHeight: "calc(100vh - 280px)" }}>
                <Table
                    stickyHeader
                    size="small"
                    sx={{ minWidth: 1100, tableLayout: "fixed" }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 250 }}>File</TableCell>
                            <TableCell sx={{ width: 300 }}>Alt text</TableCell>
                            <TableCell sx={{ width: 280 }}>Authors</TableCell>
                            <TableCell sx={{ width: 200 }}>Created</TableCell>
                            <TableCell sx={{ width: 150 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {media.map((item) => (
                            <MediaRow
                                key={item.id}
                                media={item}
                                authors={authors}
                                onUpdated={onUpdated}
                                onDelete={() => setDeleting(item)}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <MediaDeleteDialog
                media={deleting}
                open={Boolean(deleting)}
                onClose={() => setDeleting(null)}
                onDeleted={onDeleted}
            />
        </>
    );
}

function MediaRow({
    media,
    authors,
    onUpdated,
    onDelete,
}: {
    media: MediaItem;
    authors: MediaAuthorOption[];
    onUpdated: (media: MediaItem) => void;
    onDelete: () => void;
}) {
    const [altText, setAltText] = useState(media.alt_text ?? "");
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
                author_ids: authorIds,
                created_date: createdDate.toISOString(),
            });
            setAltText(updated.alt_text ?? "");
            setAuthorIds(updated.authors.map((author) => author.id));
            setCreatedDate(moment(updated.created_date));
            onUpdated(updated);
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
        <TableRow hover>
            <TableCell>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    {media.type === "image" ? (
                        <Image
                            src={media.url}
                            alt={media.alt_text || media.filename}
                            height={55}
                            width={80}
                            style={{ objectFit: "contain" }}
                        />
                    ) : (
                        <Box
                            sx={{
                                width: 80,
                                height: 55,
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
                    </Box>
                </Box>
            </TableCell>
            <TableCell>
                <TextField
                    fullWidth
                    size="small"
                    multiline
                    maxRows={3}
                    value={altText}
                    onChange={(event) => setAltText(event.target.value)}
                    slotProps={{ htmlInput: { maxLength: 2000 } }}
                />
            </TableCell>
            <TableCell>
                <MediaAuthorSelect
                    authors={authors}
                    value={authorIds}
                    onChange={setAuthorIds}
                    size="small"
                    limitTags={2}
                />
            </TableCell>
            <TableCell>
                <DateTimePicker
                    value={createdDate}
                    onChange={(value) => setCreatedDate(value)}
                    slotProps={{
                        textField: { size: "small", fullWidth: true },
                    }}
                />
            </TableCell>
            <TableCell>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => void save()}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        onClick={onDelete}
                        disabled={saving}
                    >
                        Delete
                    </Button>
                </Box>
                {error ? (
                    <Typography
                        variant="caption"
                        color="error"
                        sx={{ display: "block", mt: 1 }}
                    >
                        {error}
                    </Typography>
                ) : null}
            </TableCell>
        </TableRow>
    );
}
