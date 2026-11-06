"use server";

import path from "path";

import { asAdmin } from "@/data/authorization";
import { getRelativeImageURLFromFileName } from "@/utils/paths";
import { getExtensionForMimeType, getMediaTypeInfo } from "@/utils/media";
import { saveMediaBuffer } from "@/utils/media-storage";

import { getArticleCreatedAt } from "../queries";

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_REDIRECTS = 5;
const DOWNLOAD_TIMEOUT_MS = 20_000;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

type ImportExternalImageResult =
    | { status: true; link: string; filename: string; message?: undefined }
    | {
          status: false;
          message: string;
          link?: undefined;
          filename?: undefined;
      };

const parseHttpUrl = (value: string, base?: URL) => {
    let url: URL;
    try {
        url = base ? new URL(value, base) : new URL(value);
    } catch {
        throw new Error("The image URL is not valid");
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("Only http and https image URLs can be imported");
    }

    return url;
};

const downloadImage = async (rawUrl: string) => {
    let url = parseHttpUrl(rawUrl);

    for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
        const response = await fetch(url, {
            cache: "no-store",
            redirect: "manual",
            signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
            headers: {
                Accept: "image/*,*/*;q=0.8",
                "User-Agent": "NivaranaMediaImporter/1.0",
            },
        });

        if (REDIRECT_STATUSES.has(response.status)) {
            const location = response.headers.get("location");
            if (!location) {
                throw new Error("The image URL redirected without a location");
            }
            url = parseHttpUrl(location, url);
            continue;
        }

        if (!response.ok) {
            throw new Error(`The image server returned ${response.status}`);
        }

        return { response, url };
    }

    throw new Error("The image URL redirected too many times");
};

const getOriginalName = (url: URL, mimeType: string) => {
    const urlName = path.posix.basename(url.pathname) || "image";
    if (getMediaTypeInfo(urlName)) {
        return urlName;
    }

    const extension = getExtensionForMimeType(mimeType);
    if (!extension) {
        throw new Error("The URL did not point to a supported image");
    }

    const stem = path.parse(urlName).name || "image";
    return `${stem}.${extension}`;
};

const importExternalImage = async (
    rawUrl: string,
    postId: number,
): Promise<ImportExternalImageResult> => {
    try {
        const { response, url } = await downloadImage(rawUrl);
        const mimeType =
            response.headers.get("content-type")?.split(";")[0].trim() ?? "";

        if (
            mimeType &&
            !mimeType.startsWith("image/") &&
            mimeType !== "application/octet-stream"
        ) {
            throw new Error("The URL did not return an image");
        }

        const contentLength = Number(
            response.headers.get("content-length") ?? Number.NaN,
        );
        if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_BYTES) {
            throw new Error("The image is too large to import");
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        if (buffer.byteLength === 0) {
            throw new Error("The image was empty");
        }
        if (buffer.byteLength > MAX_IMAGE_BYTES) {
            throw new Error("The image is too large to import");
        }

        const originalName = getOriginalName(url, mimeType);
        const mediaType = getMediaTypeInfo(originalName);
        if (!mediaType || mediaType.type !== "image") {
            throw new Error("The URL did not point to a supported image");
        }

        const createdAt =
            Number.isInteger(postId) && postId > 0
                ? await getArticleCreatedAt(postId)
                : undefined;

        const media = await saveMediaBuffer({
            buffer,
            originalName,
            createdDate: createdAt ?? new Date(),
        });

        return {
            status: true,
            filename: media.filename,
            link: getRelativeImageURLFromFileName(media.filename),
        };
    } catch (error) {
        console.error(`Could not import image ${rawUrl}`, error);
        return {
            status: false,
            message:
                error instanceof Error
                    ? error.message
                    : "The image could not be imported",
        };
    }
};

export const importExternalImageAction = async (
    rawUrl: string,
    postId: number,
): Promise<ImportExternalImageResult> => {
    return asAdmin(importExternalImage)(rawUrl, postId);
};
