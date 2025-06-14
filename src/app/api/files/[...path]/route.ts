import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getImageUploadDirectory } from "@/app/(admin)/admin/api/images/setup";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const { path: filePathSegments } = await params;
    const fileName = filePathSegments[filePathSegments.length - 1];

    const dynamicFilesDir = getImageUploadDirectory();

    const fullFilePath = path.join(dynamicFilesDir, fileName);

    try {
        await fs.access(fullFilePath);
        const mimeType = getMimeType(fileName);
        const fileBuffer = await fs.readFile(fullFilePath);

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": mimeType || "application/octet-stream",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0",
            },
        });
    } catch (error: { code: string | undefined }) {
        if (error.code === "ENOENT") {
            console.error(fullFilePath);
            return new NextResponse("File not found", { status: 404 });
        }
        console.error("Error serving file:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

function getMimeType(filename: string): string | null {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case ".txt":
            return "text/plain";
        case ".html":
            return "text/html";
        case ".css":
            return "text/css";
        case ".js":
            return "application/javascript";
        case ".json":
            return "application/json";
        case ".png":
            return "image/png";
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".gif":
            return "image/gif";
        case ".svg":
            return "image/svg+xml";
        case ".pdf":
            return "application/pdf";
        default:
            return null;
    }
}
