import { NextResponse } from "next/server";

import { getRole } from "@/utils/auth";

import { toMediaItem } from "../_lib/serialize";
import { findDuplicateMedia } from "./_lib/find-duplicates";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = async () => {
    if ((await getRole()) !== "admin") {
        return NextResponse.json(
            { error: "You are not an admin" },
            { status: 403 },
        );
    }

    try {
        const groups = await findDuplicateMedia();
        return NextResponse.json({
            status: true,
            groups: groups.map((group) => ({
                hash: group.hash,
                originals: group.originals.map(toMediaItem),
                duplicates: group.duplicates.map(toMediaItem),
            })),
        });
    } catch (error) {
        console.error("Could not find duplicated media", error);
        return NextResponse.json(
            { error: "Could not find duplicated media" },
            { status: 500 },
        );
    }
};
