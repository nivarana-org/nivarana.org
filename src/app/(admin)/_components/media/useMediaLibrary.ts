"use client";

import { useCallback, useEffect, useState } from "react";

import { getAuthors, getMedia } from "@/network/api";
import type { MediaAuthorOption, MediaItem, MediaType } from "@/types/media";

export const useMediaLibrary = (type?: MediaType, enabled = true) => {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [authors, setAuthors] = useState<MediaAuthorOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        let active = true;

        Promise.all([getMedia(type), getAuthors()])
            .then(([items, authorOptions]) => {
                if (!active) return;
                setMedia(items);
                setAuthors(authorOptions);
                setError(null);
            })
            .catch((err: unknown) => {
                if (!active) return;
                setError(
                    err instanceof Error
                        ? err.message
                        : "Could not load the media library",
                );
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [enabled, type, version]);

    const reload = useCallback(() => {
        setLoading(true);
        setError(null);
        setVersion((previous) => previous + 1);
    }, []);

    const replaceMedia = useCallback((updated: MediaItem) => {
        setMedia((previous) =>
            previous.map((item) => (item.id === updated.id ? updated : item)),
        );
    }, []);

    const prependMedia = useCallback((added: MediaItem) => {
        setMedia((previous) => [added, ...previous]);
    }, []);

    const removeMedia = useCallback((id: number) => {
        setMedia((previous) => previous.filter((item) => item.id !== id));
    }, []);

    return {
        media,
        authors,
        loading,
        error,
        reload,
        replaceMedia,
        prependMedia,
        removeMedia,
    };
};
