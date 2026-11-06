import { createHash } from "crypto";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";

import { getMediaDetails, isMediaUsed } from "@/data/media";
import type { MediaDetails } from "@/data/media";
import { getImageUploadDirectory } from "@/utils/image-upload";

export type MediaDuplicateGroupDetails = {
    hash: string;
    originals: MediaDetails[];
    duplicates: MediaDetails[];
};

type MediaFile = {
    media: MediaDetails;
    size: number;
};

type HashedMediaFile = MediaFile & {
    hash: string;
};

const getMediaFilePath = (filename: string) =>
    path.join(
        /*turbopackIgnore: true*/ getImageUploadDirectory(),
        path.basename(filename),
    );

const getFileSize = async (filename: string) => {
    try {
        const fileStat = await stat(
            /*turbopackIgnore: true*/ getMediaFilePath(filename),
        );
        return fileStat.isFile() ? fileStat.size : null;
    } catch (error) {
        console.error(`Could not read media file ${filename}`, error);
        return null;
    }
};

const hashFile = (filePath: string) =>
    new Promise<string>((resolve, reject) => {
        const hash = createHash("md5");
        const stream = createReadStream(/*turbopackIgnore: true*/ filePath);

        stream.on("data", (chunk) => hash.update(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(hash.digest("hex")));
    });

const groupBy = <T, K>(items: T[], getKey: (item: T) => K) => {
    const groups = new Map<K, T[]>();
    for (const item of items) {
        const key = getKey(item);
        const group = groups.get(key) ?? [];
        group.push(item);
        groups.set(key, group);
    }
    return [...groups.values()];
};

/**
 * Groups media by MD5, then keeps used copies as originals. Unused copies are
 * safe to delete. When every copy is unused, the oldest copy is kept as the
 * original so a group is never fully removed.
 */
export const findDuplicateMedia = async (): Promise<
    MediaDuplicateGroupDetails[]
> => {
    const media = await getMediaDetails();

    // Files with a unique size cannot be duplicates. This avoids hashing most
    // of the library while still catching every possible duplicate.
    const sizedMedia = (
        await Promise.all(
            media.map(async (item): Promise<MediaFile | null> => {
                const size = await getFileSize(item.filename);
                return size === null ? null : { media: item, size };
            }),
        )
    ).filter((item): item is MediaFile => item !== null);

    const sizeCandidates = groupBy(sizedMedia, (item) => item.size)
        .filter((group) => group.length > 1)
        .flat();

    const hashedMedia = (
        await Promise.all(
            sizeCandidates.map(
                async (item): Promise<HashedMediaFile | null> => {
                    try {
                        const hash = await hashFile(
                            getMediaFilePath(item.media.filename),
                        );
                        return { ...item, hash };
                    } catch (error) {
                        console.error(
                            `Could not hash media file ${item.media.filename}`,
                            error,
                        );
                        return null;
                    }
                },
            ),
        )
    ).filter((item): item is HashedMediaFile => item !== null);

    const duplicateGroups = groupBy(hashedMedia, (item) => item.hash).filter(
        (group) => group.length > 1,
    );

    const groups = await Promise.all(
        duplicateGroups.map(async (items) => {
            const usage = await Promise.all(
                items.map((item) => isMediaUsed(item.media.id)),
            );
            const withUsage = items
                .map((item, index) => ({ ...item, used: usage[index] }))
                .sort((left, right) => left.media.id - right.media.id);

            let originals = withUsage.filter((item) => item.used);
            let duplicates = withUsage.filter((item) => !item.used);

            if (originals.length === 0) {
                originals = withUsage.slice(0, 1);
                duplicates = withUsage.slice(1);
            }

            return {
                hash: items[0].hash,
                originals: originals.map((item) => item.media),
                duplicates: duplicates.map((item) => item.media),
            };
        }),
    );

    return groups
        .filter((group) => group.duplicates.length > 0)
        .sort(
            (left, right) =>
                right.duplicates.length - left.duplicates.length ||
                left.hash.localeCompare(right.hash),
        );
};
