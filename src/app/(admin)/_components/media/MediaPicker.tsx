"use client";

import { useState } from "react";
import Image from "next/image";
import { Box, Button, Modal } from "@mui/material";

import { getImageURLFromFileName } from "@/utils/paths";
import type { MediaItem, MediaType } from "@/types/media";

import MediaLibrary from "./MediaLibrary";
import { useMediaLibrary } from "./useMediaLibrary";

const ACCEPT_BY_TYPE: Record<MediaType, string> = {
    image: "image/*",
    audio: "audio/*",
    document: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.rtf,.txt,.csv",
};

type Props = {
    defaultValue?: string;
    onChange: (value: string) => void;
    type?: MediaType;
};

export default function MediaPicker({
    defaultValue,
    onChange,
    type = "image",
}: Props) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(defaultValue ?? "");
    const {
        media,
        authors,
        loading,
        error,
        reload,
        replaceMedia,
        prependMedia,
        removeMedia,
    } = useMediaLibrary(type, open);

    const selectedMedia = media.find((item) => item.filename === selected);

    if (!open) {
        return (
            <Box>
                {selected ? (
                    <Image
                        alt={
                            selectedMedia?.alt_text ||
                            `Representative image named ${selected}`
                        }
                        src={
                            selectedMedia?.url ||
                            getImageURLFromFileName(selected)
                        }
                        width={200}
                        height={200}
                        style={{ height: "50vh", width: "auto" }}
                    />
                ) : (
                    <div>No media selected</div>
                )}
                <Button
                    onClick={() => {
                        reload();
                        setOpen(true);
                    }}
                >
                    Change
                </Button>
            </Box>
        );
    }

    const select = (item: MediaItem) => {
        setSelected(item.filename);
        setOpen(false);
        onChange(item.filename);
    };

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        height: "80%",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        overflow: "hidden",
                    }}
                >
                    <MediaLibrary
                        title="Media library"
                        media={media}
                        authors={authors}
                        loading={loading}
                        error={error}
                        selectedFilename={selected}
                        onSelect={select}
                        onUploaded={(item) => {
                            prependMedia(item);
                            select(item);
                        }}
                        onUpdated={replaceMedia}
                        onDeleted={(item) => {
                            removeMedia(item.id);
                            if (item.filename === selected) {
                                setSelected("");
                                onChange("");
                            }
                        }}
                        accept={ACCEPT_BY_TYPE[type]}
                    />
                </Box>
            </Modal>
        </>
    );
}
