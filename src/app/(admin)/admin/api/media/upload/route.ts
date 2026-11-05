import { access, unlink, writeFile } from "fs/promises";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

import { addMedia, getMediaByFilename } from "@/data/media";
import { getRole } from "@/utils/auth";
import { getImageUploadDirectory } from "@/utils/image-upload";
import { getMediaTypeInfo } from "@/utils/media";
import { getImageURLFromFileName } from "@/utils/paths";

import { toMediaItem } from "../_lib/serialize";

const fileExists = async (filePath: string) => {
    try {
        await access(filePath);
        return true;
    } catch {
        return false;
    }
};

/**
 * Picks a filename that does not collide with a file on disk or a row in the
 * media table. The extension keeps the case it arrived with.
 */
const availableFilename = async (
    uploadsDirectory: string,
    extension: string,
) => {
    const timestamp = Date.now();
    let suffix = 0;

    while (true) {
        const suffixPart = suffix === 0 ? "" : `-${suffix}`;
        const filename = `${timestamp}${suffixPart}.${extension}`;
        const filePath = path.join(
            /*turbopackIgnore: true*/ uploadsDirectory,
            filename,
        );
        const existingMedia = await getMediaByFilename(filename);
        if (!existingMedia && !(await fileExists(filePath))) {
            return filename;
        }
        suffix += 1;
    }
};

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

    const uploadsDirectory = getImageUploadDirectory();
    const filename = await availableFilename(uploadsDirectory, extension);
    const filePath = path.join(
        /*turbopackIgnore: true*/ uploadsDirectory,
        filename,
    );

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        const media = await addMedia({
            filename,
            original_name: file.name,
            type: mediaType.type,
            mime_type: mediaType.mime,
            alt_text: null,
            created_date: new Date(),
        });

        return NextResponse.json({
            status: true,
            media: toMediaItem(media),
            filename,
            link: getImageURLFromFileName(filename),
        });
    } catch (error) {
        await unlink(filePath).catch(() => undefined);
        console.error("Could not upload media", error);
        return NextResponse.json(
            { error: "The media file could not be saved" },
            { status: 500 },
        );
    }
};
