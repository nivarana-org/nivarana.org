import "server-only";

import { access, unlink, writeFile } from "fs/promises";
import path from "path";

import { addMedia, getMediaByFilename, type Media } from "@/data/media";
import { getImageUploadDirectory } from "@/utils/image-upload";
import { getMediaTypeInfo } from "@/utils/media";

type SaveMediaBufferInput = {
    buffer: Buffer;
    originalName: string;
    altText?: string | null;
    createdDate?: Date;
};

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

/**
 * Stores a file in the uploads directory and records it in the media table.
 *
 * This is the single path for every file entering the media library, so an
 * image downloaded from a URL is stored exactly like one uploaded by hand.
 */
export const saveMediaBuffer = async ({
    buffer,
    originalName,
    altText = null,
    createdDate = new Date(),
}: SaveMediaBufferInput): Promise<Media> => {
    const mediaType = getMediaTypeInfo(originalName);
    if (!mediaType) {
        throw new Error(`Unsupported media file: ${originalName}`);
    }

    const extension = path.extname(originalName).slice(1);
    if (!extension) {
        throw new Error("The uploaded file has no extension");
    }

    const uploadsDirectory = getImageUploadDirectory();
    const filename = await availableFilename(uploadsDirectory, extension);
    const filePath = path.join(
        /*turbopackIgnore: true*/ uploadsDirectory,
        filename,
    );

    try {
        await writeFile(filePath, buffer);

        return await addMedia({
            filename,
            original_name: originalName,
            type: mediaType.type,
            mime_type: mediaType.mime,
            alt_text: altText,
            created_date: createdDate,
            created_at: new Date(),
            updated_at: new Date(),
        });
    } catch (error) {
        await unlink(filePath).catch(() => undefined);
        throw error;
    }
};
