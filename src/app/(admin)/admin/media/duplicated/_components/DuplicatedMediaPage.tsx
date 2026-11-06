"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Box, Button, Typography } from "@mui/material";

import { getDuplicateMedia } from "@/network/api";
import type { MediaDuplicateGroup } from "@/types/media";

import DuplicateGroup from "./DuplicateGroup";

export default function DuplicatedMediaPage() {
    const [groups, setGroups] = useState<MediaDuplicateGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let active = true;

        getDuplicateMedia()
            .then((items) => {
                if (!active) return;
                setGroups(items);
                setError(null);
            })
            .catch((err: unknown) => {
                if (!active) return;
                setError(
                    err instanceof Error
                        ? err.message
                        : "Could not find duplicated media",
                );
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [version]);

    const reload = useCallback(() => {
        setLoading(true);
        setError(null);
        setVersion((previous) => previous + 1);
    }, []);

    const removeDeleted = useCallback((hash: string, deletedIds: number[]) => {
        setGroups((previous) =>
            previous
                .map((group) => {
                    if (group.hash !== hash) {
                        return group;
                    }
                    return {
                        ...group,
                        duplicates: group.duplicates.filter(
                            (item) => !deletedIds.includes(item.id),
                        ),
                    };
                })
                .filter((group) => group.duplicates.length > 0),
        );
    }, []);

    const duplicateCount = groups.reduce(
        (total, group) => total + group.duplicates.length,
        0,
    );

    return (
        <Box
            sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography component="h1" variant="h5">
                        Duplicated media
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {groups.length} duplicate set
                        {groups.length === 1 ? "" : "s"}, {duplicateCount}{" "}
                        unused file
                        {duplicateCount === 1 ? "" : "s"} to delete. Files are
                        matched by MD5; used copies are originals.
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button component={Link} href="/admin/media">
                        Back to media
                    </Button>
                    <Button onClick={reload} disabled={loading}>
                        Refresh
                    </Button>
                </Box>
            </Box>

            {error ? <Alert severity="error">{error}</Alert> : null}

            {loading ? (
                <Box sx={{ py: 4, textAlign: "center" }}>
                    Scanning media for duplicates...
                </Box>
            ) : error ? null : groups.length === 0 ? (
                <Box
                    sx={{
                        py: 4,
                        textAlign: "center",
                        color: "text.secondary",
                    }}
                >
                    No duplicated media found.
                </Box>
            ) : (
                groups.map((group) => (
                    <DuplicateGroup
                        key={group.hash}
                        group={group}
                        onDeleted={(deletedIds) =>
                            removeDeleted(group.hash, deletedIds)
                        }
                    />
                ))
            )}
        </Box>
    );
}
