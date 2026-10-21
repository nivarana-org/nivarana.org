"use server";
import { addOrEditAuthor } from "./queries";
import { revalidatePath } from "next/cache";

/** Form values arrive as strings (or as files); we only ever want text. */
const asText = (value: FormDataEntryValue | null) =>
    typeof value === "string" ? value : null;

export const addOrEditAuthorAction = async (formData: FormData) => {
    const id = formData.get("id");
    const name = formData.get("name");
    const email = formData.get("email");
    const description = formData.get("description");
    const image = formData.get("image");
    const slug = formData.get("slug");
    const title = formData.get("title");
    const author = {
        id: id === null ? undefined : Number(id),
        slug: asText(slug),
        name: asText(name) ?? "",
        email: asText(email),
        description: asText(description),
        image: asText(image),
        title: asText(title),
    };
    try {
        await addOrEditAuthor(author);
        if (author.slug) {
            clearCache(author.slug);
        }
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
