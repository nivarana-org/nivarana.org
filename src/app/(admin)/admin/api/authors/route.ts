import { NextResponse } from "next/server";

import { getAuthorOptions } from "@/data/authors";
import { getRole } from "@/utils/auth";

export const dynamic = "force-dynamic";

export const GET = async () => {
    if ((await getRole()) !== "admin") {
        return NextResponse.json(
            { error: "You are not an admin" },
            { status: 403 },
        );
    }

    try {
        const authors = await getAuthorOptions();
        return NextResponse.json({ status: true, authors });
    } catch (error) {
        console.error("Could not read author options", error);
        return NextResponse.json(
            { error: "Could not read author options" },
            { status: 500 },
        );
    }
};
