"use client";

import Image from "next/image";
import { Box, Button } from "@mui/material";

import type { MediaItem } from "@/types/media";

type Props = {
    media: MediaItem[];
    selectedFilename?: string | null;
    onSelect?: (media: MediaItem) => void;
    onEdit?: (media: MediaItem) => void;
    emptyMessage?: string;
};

export default function MediaGrid({
    media,
    selectedFilename,
    onSelect,
    onEdit,
    emptyMessage = "No media yet.",
}: Props) {
    if (media.length === 0) {
        return <Box sx={{ py: 4, textAlign: "center" }}>{emptyMessage}</Box>;
    }

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 2,
                width: "100%",
            }}
        >
            {media.map((item) => {
                const selected = item.filename === selectedFilename;
                return (
                    <Box
                        key={item.id}
                        onClick={() => onSelect?.(item)}
                        sx={{
                            border: 3,
                            borderColor: selected ? "primary.main" : "divider",
                            borderRadius: 1,
                            cursor: onSelect ? "pointer" : "default",
                            p: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            minWidth: 0,
                        }}
                    >
                        {item.type === "image" ? (
                            <Image
                                src={item.url}
                                alt={item.alt_text || item.filename}
                                width={200}
                                height={150}
                                style={{
                                    width: "100%",
                                    height: 150,
                                    objectFit: "contain",
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    height: 150,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    wordBreak: "break-all",
                                    fontSize: 12,
                                }}
                            >
                                {item.filename}
                            </Box>
                        )}
                        <Box
                            sx={{
                                fontSize: 12,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                            title={item.filename}
                        >
                            {item.alt_text || item.filename}
                        </Box>
                        {onEdit ? (
                            <Button
                                size="small"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onEdit(item);
                                }}
                            >
                                Edit details
                            </Button>
                        ) : null}
                    </Box>
                );
            })}
        </Box>
    );
}
