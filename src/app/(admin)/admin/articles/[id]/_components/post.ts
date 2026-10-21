"use server";
import { addOrEditPost } from "@/data/posts";
import { revalidatePath } from "next/cache";

export const addOrEditPostAction = async (formData: FormData) => {
    const id = formData.get("id");
    const title = formData.get("title");
    const contents = formData.get("contents");
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
    const intro = formData.get("intro");
    const image = formData.get("image");
    const slug = formData.get("slug");
    const status = formData.get("status");
    const publishedAt = formData.get("published_at");
    const language = formData.get("language");
    const type = formData.get("type");
    const post = {
        id,
        slug,
        title,
        contents,
        authors,
        tags,
        categories,
        intro,
        image,
        status,
        published_at: publishedAt ? new Date(publishedAt) : null,
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
