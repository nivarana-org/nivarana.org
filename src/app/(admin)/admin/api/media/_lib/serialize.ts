import type { Media } from "@/data/media";
import type { MediaItem } from "@/types/media";
import { getImageURLFromFileName } from "@/utils/paths";

export const toMediaItem = (media: Media): MediaItem => ({
    ...media,
    created_date: media.created_date.toISOString(),
    created_at: media.created_at.toISOString(),
    updated_at: media.updated_at.toISOString(),
    url: getImageURLFromFileName(media.filename),
});
