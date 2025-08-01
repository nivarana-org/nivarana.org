"use server";
import { addOrEditPost } from "@/data/cms";
import { revalidatePath } from "next/cache";

export const addOrEditPostAction = async (formData: FormData) => {
    const id = formData.get("id");
    const page_title = formData.get("title");
    const description = formData.get("description");
    const authors = (formData.get("authors") as string)
        ?.split(",")
        ?.map((a: string) => Number(a));
    const tags = JSON.parse(formData.get("tags") as string).map((t: string) =>
        Number(t),
    );
    const categories = formData
        .get("category")
        ?.split(",")
        ?.map((c: string) => Number(c));
    const meta_description = formData.get("intro");
    const upload_image = formData.get("image");
    const path = formData.get("path");
    const status = formData.get("status");
    const scheduledTime = formData.get("scheduled_time");
    const language = formData.get("language");
    const type = formData.get("type");
    const post = {
        id,
        path,
        page_title,
        description,
        authors,
        tags,
        categories,
        meta_description,
        upload_image,
        status,
        scheduled_time: scheduledTime ? new Date(scheduledTime) : null,
        language,
        type,
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
