import path from "path";

import { NextRequest, NextResponse } from "next/server";

import { getRole } from "@/utils/auth";
import { getMediaTypeInfo } from "@/utils/media";
import { saveMediaBuffer } from "@/utils/media-storage";
import { getImageURLFromFileName } from "@/utils/paths";

import { toMediaItem } from "../_lib/serialize";

export const POST = async (req: NextRequest) => {
    if ((await getRole()) !== "admin") {
        return NextResponse.json(
            { error: "You are not an admin" },
            { status: 403 },
        );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
        return NextResponse.json(
            { error: "No files received." },
            { status: 400 },
        );
    }

    const mediaType = getMediaTypeInfo(file.name);
    if (!mediaType) {
        return NextResponse.json(
            { error: `Unsupported media file: ${file.name}` },
            { status: 400 },
        );
    }

    const extension = path.extname(file.name).slice(1);
    if (!extension) {
        return NextResponse.json(
            { error: "The uploaded file has no extension" },
            { status: 400 },
        );
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const media = await saveMediaBuffer({
            buffer,
            originalName: file.name,
        });

        return NextResponse.json({
            status: true,
            media: toMediaItem({ ...media, authors: [] }),
            filename: media.filename,
            link: getImageURLFromFileName(media.filename),
        });
    } catch (error) {
        console.error("Could not upload media", error);
        return NextResponse.json(
            { error: "The media file could not be saved" },
            { status: 500 },
        );
    }
};
