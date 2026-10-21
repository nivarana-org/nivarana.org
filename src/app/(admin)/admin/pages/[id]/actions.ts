"use server";
import { addOrEditPage } from "./queries";
import { revalidatePath } from "next/cache";

export const addOrEditPageAction = async (formData: FormData) => {
    const id = formData.get("id");
    const slug = formData.get("slug");
    const title = formData.get("title");
    const contents = formData.get("contents");

    const page = {
        id: id ? Number(id) : undefined,
        slug: slug as string,
        title: title as string,
        contents: contents as string,
    };

    try {
        await addOrEditPage(page);
        revalidatePath("/", "layout");
        revalidatePath("/admin/pages");
        return { status: true };
    } catch (err) {
        console.error(err);
        return { status: false, message: err };
    }
};
