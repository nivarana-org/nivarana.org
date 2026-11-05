import { NextRequest, NextResponse } from "next/server";

import { updateMediaMetadata } from "@/data/media";
import { getRole } from "@/utils/auth";

import { toMediaItem } from "../_lib/serialize";

type UpdateBody = {
    alt_text?: unknown;
    created_date?: unknown;
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
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
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

    if (Object.keys(metadata).length === 0) {
        return NextResponse.json(
            { error: "No supported metadata was provided" },
            { status: 400 },
        );
    }

    try {
        const media = await updateMediaMetadata(id, metadata);
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
