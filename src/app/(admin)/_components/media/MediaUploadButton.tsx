"use client";

import { useRef, useState } from "react";
import { Button } from "@mui/material";

import { uploadMedia } from "@/network/api";
import type { MediaItem } from "@/types/media";

type Props = {
    onUploaded: (media: MediaItem) => void;
    accept?: string;
    label?: string;
};

export default function MediaUploadButton({
    onUploaded,
    accept,
    label = "Upload media",
}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFile = async (file: File) => {
        setUploading(true);
        try {
            const result = await uploadMedia(file);
            onUploaded(result.media);
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "The file could not be uploaded",
            );
        } finally {
            setUploading(false);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    return (
        <>
            <Button component="label" variant="outlined" disabled={uploading}>
                {uploading ? "Uploading..." : label}
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    hidden
                    onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                            void handleFile(file);
                        }
                    }}
                />
            </Button>
        </>
    );
}
