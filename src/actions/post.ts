"use server";
import { addOrEditPost } from "@/data/cms";

export const addOrEditPostAction = async (formData: FormData) => {
    const id = formData.get("id");
    const page_title = formData.get("title");
    const description = formData.get("description");
    const authors = formData.get("authors");
    const category_name = formData.get("category");
    const meta_description = formData.get("intro");
    const post = {
        id,
        page_title,
        description,
        authors,
        category_name,
        meta_description,
    };
    try {
        await addOrEditPost(post);
    } catch (err) {
        console.error(err);
    }
};
