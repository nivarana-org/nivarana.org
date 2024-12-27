import { NextResponse } from "next/server";
import path from "path";
import fs from "node:fs";

const sortFiles = (files) => {
    return files.sort((a, b) => {
        const timestampA = parseInt(path.parse(a).name, 10);
        const timestampB = parseInt(path.parse(b).name, 10);

        // Reverse order (newest first)
        return timestampB - timestampA;
    });
};

export const GET = async () => {
    const uploadsDirectory = path.join(process.cwd(), "public", "uploads");

    const files = await fs.readdirSync(uploadsDirectory);
    const sortedFiles = sortFiles(files);

    const fileData = sortedFiles.map((filename) => {
        const filePath = `/uploads/${filename}`; // Construct public URL
        return {
            filename: filename,
            url: filePath,
        };
    });

    return NextResponse.json({ status: 200, images: fileData });
};
