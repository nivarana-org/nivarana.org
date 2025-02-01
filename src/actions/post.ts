"use server";
import { addOrEditPost } from "@/data/cms";
import { revalidatePath } from "next/cache";

export const addOrEditPostAction = async (formData: FormData) => {
    const id = formData.get("id");
    const page_title = formData.get("title");
    const description = formData.get("description");
    const authors = (formData
        .get("authors") as string)
        ?.split(",")
        ?.map((a: string) => Number(a));
    const category_name = formData.get("category");
    const meta_description = formData.get("intro");
    const upload_image = formData.get("image");
    const path = formData.get("path");
    const post = {
        id,
        path,
        page_title,
        description,
        authors,
        category_name,
        meta_description,
        upload_image,
    };
    try {
        await addOrEditPost(post);
        clearCache();
        return { status: true };
    } catch (err) {
        console.error(err);
        return { status: false, message: err };
    }
};

export async function clearCache() {
    revalidatePath("/", "layout");
}
