"use server";
import { addTag } from "@/data/tags";

type AddTagResult =
    | { status: true; message?: undefined; data: { id: number; name: string } }
    | { status: false; message: string; data?: undefined };

export const addTagAction = async (
    name: string,
    path: string,
): Promise<AddTagResult> => {
    try {
        return await addTag(name, path);
    } catch (err) {
        console.error(err);
        return { status: false, message: `${err}` };
    }
};
