export const MEDIA_TYPES = ["image", "audio", "document"] as const;

export type MediaType = (typeof MEDIA_TYPES)[number];

export type MediaItem = {
    id: number;
    filename: string;
    original_name: string | null;
    type: MediaType;
    mime_type: string | null;
    alt_text: string | null;
    created_date: string;
    created_at: string;
    updated_at: string;
    url: string;
};

export type MediaMetadataInput = {
    alt_text?: string | null;
    created_date?: string;
};

export const isMediaType = (value: unknown): value is MediaType =>
    typeof value === "string" &&
    (MEDIA_TYPES as readonly string[]).includes(value);
