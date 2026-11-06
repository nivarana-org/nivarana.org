import { access, mkdir, rename } from "fs/promises";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

import { getExistingAuthorIds } from "@/data/authors";
import {
    deleteMediaRecord,
    getMediaById,
    isMediaUsed,
    updateMediaDetails,
} from "@/data/media";
import { getRole } from "@/utils/auth";
import { getImageUploadDirectory } from "@/utils/image-upload";

import { toMediaItem } from "../_lib/serialize";

type UpdateBody = {
    alt_text?: unknown;
    credit_text?: unknown;
    created_date?: unknown;
    author_ids?: unknown;
};

const parseMediaId = (rawId: string) => {
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }
    return id;
};

const fileExists = async (filePath: string) => {
    try {
        await access(filePath);
        return true;
    } catch {
        return false;
    }
};

const isErrnoException = (
    error: unknown,
): error is NodeJS.ErrnoException & { code: string } =>
    error instanceof Error && "code" in error;

/**
 * Moves a file into uploads/.trash without overwriting an older deleted file.
 * Returning the source and destination lets the caller restore the file if the
 * database delete fails.
 */
const moveToTrash = async (filename: string) => {
    const uploadsDirectory = getImageUploadDirectory();
    const trashDirectory = path.join(uploadsDirectory, ".trash");
    const safeFilename = path.basename(filename);
    const parsed = path.parse(safeFilename);
    const source = path.join(
        /*turbopackIgnore: true*/ uploadsDirectory,
        safeFilename,
    );

    await mkdir(trashDirectory, { recursive: true });

    let trashFilename = safeFilename;
    let suffix = 0;
    while (
        await fileExists(
            path.join(/*turbopackIgnore: true*/ trashDirectory, trashFilename),
        )
    ) {
        suffix += 1;
        trashFilename = `${parsed.name}-${Date.now()}-${suffix}${parsed.ext}`;
    }

    const destination = path.join(
        /*turbopackIgnore: true*/ trashDirectory,
        trashFilename,
    );

    try {
        await rename(source, destination);
        return { source, destination };
    } catch (error) {
        if (isErrnoException(error) && error.code === "ENOENT") {
            return null;
        }
        throw error;
    }
};

export const PATCH = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) => {
    if ((await getRole()) !== "admin") {
        return NextResponse.json(
            { error: "You are not an admin" },
            { status: 403 },
        );
    }

    const { id: rawId } = await params;
    const id = parseMediaId(rawId);
    if (id === null) {
        return NextResponse.json(
            { error: "Invalid media id" },
            { status: 400 },
        );
    }

    let body: UpdateBody;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Expected a JSON body" },
            { status: 400 },
        );
    }

    const metadata: {
        alt_text?: string | null;
        credit_text?: string | null;
        created_date?: Date;
    } = {};

    if ("alt_text" in body) {
        if (body.alt_text !== null && typeof body.alt_text !== "string") {
            return NextResponse.json(
                { error: "alt_text must be a string or null" },
                { status: 400 },
            );
        }
        const altText = body.alt_text?.trim() ?? null;
        if (altText !== null && altText.length > 2000) {
            return NextResponse.json(
                { error: "alt_text must be 2000 characters or fewer" },
                { status: 400 },
            );
        }
        metadata.alt_text = altText || null;
    }

    if ("credit_text" in body) {
        if (body.credit_text !== null && typeof body.credit_text !== "string") {
            return NextResponse.json(
                { error: "credit_text must be a string or null" },
                { status: 400 },
            );
        }
        const creditText = body.credit_text?.trim() ?? null;
        if (creditText !== null && creditText.length > 10000) {
            return NextResponse.json(
                { error: "credit_text must be 10000 characters or fewer" },
                { status: 400 },
            );
        }
        metadata.credit_text = creditText || null;
    }

    if ("created_date" in body) {
        if (typeof body.created_date !== "string") {
            return NextResponse.json(
                { error: "created_date must be an ISO date string" },
                { status: 400 },
            );
        }
        const createdDate = new Date(body.created_date);
        if (Number.isNaN(createdDate.getTime())) {
            return NextResponse.json(
                { error: "created_date is not a valid date" },
                { status: 400 },
            );
        }
        metadata.created_date = createdDate;
    }

    let authorIds: number[] | undefined;
    if ("author_ids" in body) {
        if (!Array.isArray(body.author_ids)) {
            return NextResponse.json(
                { error: "author_ids must be an array of author ids" },
                { status: 400 },
            );
        }
        if (
            !body.author_ids.every(
                (authorId) =>
                    typeof authorId === "number" &&
                    Number.isInteger(authorId) &&
                    authorId > 0,
            )
        ) {
            return NextResponse.json(
                { error: "author_ids must contain positive integers" },
                { status: 400 },
            );
        }
        authorIds = [...new Set(body.author_ids as number[])];
    }

    if (Object.keys(metadata).length === 0 && authorIds === undefined) {
        return NextResponse.json(
            { error: "No supported metadata was provided" },
            { status: 400 },
        );
    }

    try {
        if (authorIds !== undefined) {
            const existingAuthorIds = await getExistingAuthorIds(authorIds);
            if (existingAuthorIds.length !== authorIds.length) {
                return NextResponse.json(
                    { error: "One or more authors do not exist" },
                    { status: 400 },
                );
            }
        }

        const media = await updateMediaDetails(id, metadata, authorIds);
        return NextResponse.json({
            status: true,
            media: toMediaItem(media),
        });
    } catch (error) {
        console.error(`Could not update media ${id}`, error);
        return NextResponse.json(
            { error: "The media record could not be updated" },
            { status: 500 },
        );
    }
};

export const DELETE = async (
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) => {
    if ((await getRole()) !== "admin") {
        return NextResponse.json(
            { error: "You are not an admin" },
            { status: 403 },
        );
    }

    const { id: rawId } = await params;
    const id = parseMediaId(rawId);
    if (id === null) {
        return NextResponse.json(
            { error: "Invalid media id" },
            { status: 400 },
        );
    }

    try {
        const media = await getMediaById(id);
        if (!media) {
            return NextResponse.json(
                { error: "Media not found" },
                { status: 404 },
            );
        }

        if (await isMediaUsed(id)) {
            return NextResponse.json(
                {
                    error: "This media is still used in published content and cannot be deleted.",
                },
                { status: 409 },
            );
        }

        const moved = await moveToTrash(media.filename);

        try {
            await deleteMediaRecord(id);
        } catch (error) {
            if (moved) {
                await rename(moved.destination, moved.source).catch(
                    (restoreError) => {
                        console.error(
                            `Could not restore ${media.filename} after a failed delete`,
                            restoreError,
                        );
                    },
                );
            }
            throw error;
        }

        return NextResponse.json({ status: true });
    } catch (error) {
        console.error(`Could not delete media ${id}`, error);
        return NextResponse.json(
            { error: "The media record could not be deleted" },
            { status: 500 },
        );
    }
};
