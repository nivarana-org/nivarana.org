import { NextResponse } from "next/server";

import { getMediaDetails } from "@/data/media";
import { isMediaType } from "@/types/media";
import { getRole } from "@/utils/auth";

import { toMediaItem } from "./_lib/serialize";

export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
    if ((await getRole()) !== "admin") {
        return NextResponse.json(
            { error: "You are not an admin" },
            { status: 403 },
        );
    }

    const requestedType = new URL(request.url).searchParams.get("type");
    if (requestedType !== null && !isMediaType(requestedType)) {
        return NextResponse.json(
            { error: `Unknown media type: ${requestedType}` },
            { status: 400 },
        );
    }

    try {
        const media = await getMediaDetails(requestedType ?? undefined);
        return NextResponse.json({
            status: true,
            media: media.map(toMediaItem),
        });
    } catch (error) {
        console.error("Could not read the media library", error);
        return NextResponse.json(
            { error: "Could not read the media library" },
            { status: 500 },
        );
    }
};
