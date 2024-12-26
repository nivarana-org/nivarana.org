import { NextResponse } from "next/server";
import path from "path";
import fs from "node:fs";

export const GET = async () => {
    const uploadsDirectory = path.join(process.cwd(), "public", "uploads");

    const files = await fs.readdirSync(uploadsDirectory);

    const fileData = files.map((filename) => {
        const filePath = `/uploads/${filename}`; // Construct public URL
        return {
            filename: filename,
            url: filePath,
        };
    });

    return NextResponse.json({ status: 200, images: fileData });
};
