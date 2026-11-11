import type { MediaAuthor } from "@/types/media";

import { RELATIVE_IMAGE_PREFIX } from "@/utils/paths";

export type MediaMeta = {
    authors: MediaAuthor[];
    creditText: string | null;
    altText: string | null;
};

/** Media metadata keyed by the media table's `filename` column. */
export type MediaMetaMap = Record<string, MediaMeta>;

const IMAGE_SOURCE_PATTERN =
    /<img\b[^>]*\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;

/**
 * Reduces a chapter image filename or an image URL found in body HTML to the
 * filename stored in the media table.
 */
export const getImageFilenameFromSource = (
    source?: string | null,
): string | null => {
    if (!source) {
        return null;
    }

    let value = source.trim();
    if (value.length === 0) {
        return null;
    }

    if (value.startsWith(RELATIVE_IMAGE_PREFIX)) {
        value = value.slice(RELATIVE_IMAGE_PREFIX.length);
    } else {
        value = value.split(/[?#]/, 1)[0];
        const lastSlash = value.lastIndexOf("/");
        if (lastSlash >= 0) {
            value = value.slice(lastSlash + 1);
        }
    }

    value = value.split(/[?#]/, 1)[0];
    if (value.length === 0) {
        return null;
    }

    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
};

export const imageFilenamesFromHtml = (html: string): string[] => {
    const filenames = new Set<string>();

    for (const match of html.matchAll(IMAGE_SOURCE_PATTERN)) {
        const filename = getImageFilenameFromSource(
            match[1] ?? match[2] ?? match[3],
        );
        if (filename) {
            filenames.add(filename);
        }
    }

    return [...filenames];
};

export const getMediaMeta = (
    mediaMeta: MediaMetaMap,
    source?: string | null,
): MediaMeta | undefined => {
    const filename = getImageFilenameFromSource(source);
    return filename ? mediaMeta[filename] : undefined;
};

export const hasImageCredit = (meta?: MediaMeta): meta is MediaMeta =>
    Boolean(
        meta && (meta.authors.length > 0 || meta.creditText?.trim().length),
    );
