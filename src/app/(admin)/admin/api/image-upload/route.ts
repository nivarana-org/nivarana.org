import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const POST = async (req) => {
    const formData = await req.formData();

    const file = formData.get("file");
    if (!file) {
        return NextResponse.json(
            { error: "No files received." },
            { status: 400 },
        );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
    try {
        await writeFile(
            path.join(process.cwd(), "public/uploads/" + filename),
            buffer,
        );
        return NextResponse.json({
            Message: "Success",
            status: 201,
            link: "/uploads/" + filename,
        });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
};
