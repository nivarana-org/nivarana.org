"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
import RichTextEditor from "@/app/(admin)/admin/_components/RichTextEditor";

const toPlainText = (html: string) =>
    html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();

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
                    sx={{ minWidth: 1420, tableLayout: "fixed" }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 250 }}>File</TableCell>
                            <TableCell sx={{ width: 280 }}>Alt text</TableCell>
                            <TableCell sx={{ width: 260 }}>
                                Credit text
                            </TableCell>
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
    const [creditText, setCreditText] = useState(media.credit_text ?? "");
    const [authorIds, setAuthorIds] = useState<number[]>(
        media.authors.map((author) => author.id),
    );
    const [createdDate, setCreatedDate] = useState<Moment | null>(
        moment(media.created_date),
    );
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [creditDialogOpen, setCreditDialogOpen] = useState(false);
    const [savingCredit, setSavingCredit] = useState(false);
    const [creditError, setCreditError] = useState<string | null>(null);

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
                author_ids: authorIds,
                created_date: createdDate.toISOString(),
            });
            setAltText(updated.alt_text ?? "");
            setCreditText(updated.credit_text ?? "");
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

    const saveCredit = async () => {
        setSavingCredit(true);
        setCreditError(null);
        try {
            const updated = await updateMedia(media.id, {
                credit_text: creditText.trim() || null,
            });
            setCreditText(updated.credit_text ?? "");
            onUpdated(updated);
            setCreditDialogOpen(false);
        } catch (err) {
            setCreditError(
                err instanceof Error
                    ? err.message
                    : "The credit text could not be saved",
            );
        } finally {
            setSavingCredit(false);
        }
    };

    const creditPreview = toPlainText(creditText);

    return (
        <>
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
                    <Typography
                        variant="caption"
                        color={
                            creditPreview ? "text.primary" : "text.secondary"
                        }
                        title={creditPreview}
                        sx={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {creditPreview || "No credit text"}
                    </Typography>
                    <Button
                        size="small"
                        onClick={() => {
                            setCreditError(null);
                            setCreditDialogOpen(true);
                        }}
                        disabled={saving}
                    >
                        Edit credit
                    </Button>
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
            <Dialog
                open={creditDialogOpen}
                onClose={
                    savingCredit ? undefined : () => setCreditDialogOpen(false)
                }
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Credit text</DialogTitle>
                <DialogContent>
                    <RichTextEditor
                        value={creditText}
                        onChange={setCreditText}
                        height={300}
                    />
                    {creditError ? (
                        <Typography
                            variant="caption"
                            color="error"
                            sx={{ display: "block", mt: 1 }}
                        >
                            {creditError}
                        </Typography>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setCreditDialogOpen(false)}
                        disabled={savingCredit}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => void saveCredit()}
                        disabled={savingCredit}
                    >
                        {savingCredit ? "Saving..." : "Save credit"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
