"use server";
import { addOrEditAuthor } from "@/data/cms";
import { revalidatePath } from "next/cache";

export const addOrEditAuthorAction = async (formData: FormData) => {
    const id = formData.get("id");
    const author_name = formData.get("name");
    const description = formData.get("description");
    const upload_image = formData.get("image");
    const path = formData.get("path");
    const first_peragraph = formData.get("title")
    const author = {
        id,
        path,
        author_name,
        description,
        upload_image,
        first_peragraph
    };
    try {
        await addOrEditAuthor(author);
        clearCache(author.path);
        return { status: true };
    } catch (err) {
        console.error(err);
        return { status: false, message: err };
    }
};


export async function clearCache(path: string) {
    revalidatePath("/", "layout");
    revalidatePath(`/author/${path}`, "page")
}