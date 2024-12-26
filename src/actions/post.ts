"use server";
import { addOrEditPost } from "@/data/cms";

export const addOrEditPostAction = async (formData: FormData) => {
    const id = formData.get("id");
    const page_title = formData.get("title");
    const description = formData.get("description");
    const authors = formData.get("authors");
    const post = { id, page_title, description, authors };
    try {
        await addOrEditPost(post);
    } catch (err) {
        console.error(err);
    }
};
