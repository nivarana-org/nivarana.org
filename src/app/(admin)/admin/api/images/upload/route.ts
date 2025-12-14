import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { getExtension } from "@/utils/string";
import { getImageUploadDirectory } from "../setup";
import { getImageURLFromFileName } from "@/utils/paths";
import { getRole } from "@/utils/auth";

export const POST = async (req: NextRequest) => {
    if ((await getRole()) !== "admin") {
        return NextResponse.json(
            { error: "You are not an admin" },
            { status: 403 },
        );
    }
    const formData = await req.formData();

    const file = formData.get("file");
    if (!file) {
        return NextResponse.json(
            { error: "No files received." },
            { status: 400 },
        );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
    const time = Math.floor(Date.now() / 1000);
    const extension = getExtension(file.name);
    const filename = `${time}.${extension}`;
    const uploadsDirectory = getImageUploadDirectory();
    const filePath = path.join(uploadsDirectory, filename);
    try {
        await writeFile(filePath, buffer);
        return NextResponse.json({
            Message: "Success",
            status: 201,
            link: getImageURLFromFileName(filename),
            filename,
        });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
