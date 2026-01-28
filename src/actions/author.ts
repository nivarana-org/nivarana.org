"use server";
import { addOrEditAuthor } from "@/data/cms";
import { revalidatePath } from "next/cache";

export const addOrEditAuthorAction = async (formData: FormData) => {
    const id = formData.get("id");
    const name = formData.get("name");
    const email = formData.get("email");
    const description = formData.get("description");
    const image = formData.get("image");
    const path = formData.get("path");
    const title = formData.get("title");
    const author = {
        id,
        path,
        name,
        email,
        description,
        image,
        title,
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
    revalidatePath(`/author/${path}`, "page");
}
