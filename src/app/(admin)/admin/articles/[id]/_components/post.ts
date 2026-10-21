"use server";
import { addOrEditPost } from "@/data/posts";
import { isPostLayout } from "@/data/story";
import { revalidatePath } from "next/cache";

export const addOrEditPostAction = async (formData: FormData) => {
    const text = (key: string) => {
        const value = formData.get(key);
        return typeof value === "string" ? value : "";
    };
    const id = Number(text("id"));
    const title = text("title");
    const contents = text("contents");
    const authors = text("authors")
        .split(",")
        .filter((a) => a.length > 0)
        .map((a) => Number(a));
    const tags = JSON.parse(text("tags") || "[]").map((t: string) => Number(t));
    const category = Number(text("category"));
    const intro = text("intro");
    const image = text("image");
    const slug = text("slug");
    const status = text("status");
    const publishedAt = text("published_at");
    const language = text("language");
    const layout = text("layout");
    const post = {
        id,
        slug,
        title,
        contents,
        authors,
        tags,
        category,
        intro,
        image,
        status,
        published_at: publishedAt ? new Date(publishedAt) : null,
        language,
        // The layout the author picked. When it is not a layout we know, the
        // layout is derived from the number of chapters.
        layout: isPostLayout(layout) ? layout : null,
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
