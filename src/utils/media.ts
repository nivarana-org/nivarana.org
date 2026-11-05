import path from "path";

import type { MediaType } from "@/types/media";

type MediaTypeInfo = {
    type: MediaType;
    mime: string;
};

const MEDIA_TYPE_INFO: Record<string, MediaTypeInfo> = {
    // Images
    avif: { type: "image", mime: "image/avif" },
    bmp: { type: "image", mime: "image/bmp" },
    gif: { type: "image", mime: "image/gif" },
    heic: { type: "image", mime: "image/heic" },
    heif: { type: "image", mime: "image/heif" },
    jpeg: { type: "image", mime: "image/jpeg" },
    jpg: { type: "image", mime: "image/jpeg" },
    png: { type: "image", mime: "image/png" },
    svg: { type: "image", mime: "image/svg+xml" },
    tif: { type: "image", mime: "image/tiff" },
    tiff: { type: "image", mime: "image/tiff" },
    webp: { type: "image", mime: "image/webp" },

    // Audio
    aac: { type: "audio", mime: "audio/aac" },
    flac: { type: "audio", mime: "audio/flac" },
    m4a: { type: "audio", mime: "audio/mp4" },
    mp3: { type: "audio", mime: "audio/mpeg" },
    oga: { type: "audio", mime: "audio/ogg" },
    ogg: { type: "audio", mime: "audio/ogg" },
    wav: { type: "audio", mime: "audio/wav" },

    // Documents
    csv: { type: "document", mime: "text/csv" },
    doc: { type: "document", mime: "application/msword" },
    docx: {
        type: "document",
        mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    odt: { type: "document", mime: "application/vnd.oasis.opendocument.text" },
    pdf: { type: "document", mime: "application/pdf" },
    ppt: { type: "document", mime: "application/vnd.ms-powerpoint" },
    pptx: {
        type: "document",
        mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    },
    rtf: { type: "document", mime: "application/rtf" },
    txt: { type: "document", mime: "text/plain" },
    xls: { type: "document", mime: "application/vnd.ms-excel" },
    xlsx: {
        type: "document",
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
};

/**
 * Looks up the media type and MIME type for a filename. The extension is
 * lowercased for lookup only; the filename itself is never altered.
 */
export const getMediaTypeInfo = (
    filename: string,
): MediaTypeInfo | undefined => {
    const extension = path.extname(filename).slice(1).toLowerCase();
    return MEDIA_TYPE_INFO[extension];
};
