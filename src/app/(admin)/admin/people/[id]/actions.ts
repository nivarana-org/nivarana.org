"use server";
import { addOrEditAuthor } from "./queries";
import { revalidatePath } from "next/cache";

export const addOrEditAuthorAction = async (formData: FormData) => {
    const id = formData.get("id");
    const name = formData.get("name");
    const email = formData.get("email");
    const description = formData.get("description");
    const image = formData.get("image");
    const slug = formData.get("slug");
    const title = formData.get("title");
    const author = {
        id,
        slug,
        name,
        email,
        description,
        image,
        title,
    };
    try {
        await addOrEditAuthor(author);
        clearCache(author.slug);
        return { status: true };
    } catch (err) {
        console.error(err);
        return { status: false, message: err };
    }
};

export async function clearCache(slug: string) {
    revalidatePath("/", "layout");
    revalidatePath(`/author/${slug}`, "page");
}
