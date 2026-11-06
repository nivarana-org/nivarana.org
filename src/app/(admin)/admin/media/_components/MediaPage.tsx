"use client";

import { useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    MenuItem,
    Pagination,
    TextField,
    Typography,
} from "@mui/material";

import { MEDIA_TYPES } from "@/types/media";
import type { MediaItem, MediaType } from "@/types/media";

import MediaUploadButton from "@/app/(admin)/_components/media/MediaUploadButton";
import { useMediaLibrary } from "@/app/(admin)/_components/media/useMediaLibrary";

import MediaTable from "./MediaTable";

const PAGE_SIZE = 50;

export default function MediaPage() {
    const {
        media,
        authors,
        loading,
        error,
        reload,
        replaceMedia,
        prependMedia,
        removeMedia,
    } = useMediaLibrary();
    const [query, setQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<"all" | MediaType>("all");
    const [authorFilter, setAuthorFilter] = useState("all");
    const [page, setPage] = useState(1);

    const filteredMedia = useMemo(() => {
        const search = query.trim().toLowerCase();
        return media.filter((item) => {
            if (typeFilter !== "all" && item.type !== typeFilter) {
                return false;
            }

            if (authorFilter === "none" && item.authors.length > 0) {
                return false;
            }

            if (
                authorFilter !== "all" &&
                authorFilter !== "none" &&
                !item.authors.some(
                    (author) => author.id === Number(authorFilter),
                )
            ) {
                return false;
            }

            if (!search) {
                return true;
            }

            return (
                item.filename.toLowerCase().includes(search) ||
                (item.original_name ?? "").toLowerCase().includes(search) ||
                (item.alt_text ?? "").toLowerCase().includes(search) ||
                item.authors.some((author) =>
                    author.name.toLowerCase().includes(search),
                )
            );
        });
    }, [media, query, typeFilter, authorFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredMedia.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const visibleMedia = filteredMedia.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    const resetPage = () => setPage(1);

    return (
        <Box
            sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minHeight: 0,
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
                <Box>
                    <Typography component="h1" variant="h5">
                        Media
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {filteredMedia.length} of {media.length} files
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button onClick={reload} disabled={loading}>
                        Refresh
                    </Button>
                    <MediaUploadButton
                        onUploaded={(item) => {
                            prependMedia(item);
                            resetPage();
                        }}
                    />
                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <TextField
                    size="small"
                    label="Search media"
                    placeholder="Filename, alt text, author"
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        resetPage();
                    }}
                    sx={{ flex: 1, minWidth: 240 }}
                />
                <TextField
                    select
                    size="small"
                    label="Type"
                    value={typeFilter}
                    onChange={(event) => {
                        setTypeFilter(event.target.value as "all" | MediaType);
                        resetPage();
                    }}
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="all">All types</MenuItem>
                    {MEDIA_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    size="small"
                    label="Author"
                    value={authorFilter}
                    onChange={(event) => {
                        setAuthorFilter(event.target.value);
                        resetPage();
                    }}
                    sx={{ minWidth: 220 }}
                >
                    <MenuItem value="all">All authors</MenuItem>
                    <MenuItem value="none">No author</MenuItem>
                    {authors.map((author) => (
                        <MenuItem key={author.id} value={String(author.id)}>
                            {author.name} ({author.mediaCount})
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            {error ? <Alert severity="error">{error}</Alert> : null}
            {loading ? (
                <Box sx={{ py: 4, textAlign: "center" }}>Loading media...</Box>
            ) : error ? null : (
                <MediaTable
                    media={visibleMedia}
                    authors={authors}
                    onUpdated={replaceMedia}
                    onDeleted={(item: MediaItem) => removeMedia(item.id)}
                />
            )}

            {totalPages > 1 ? (
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_event, value) => setPage(value)}
                    sx={{ alignSelf: "center" }}
                />
            ) : null}
        </Box>
    );
}
