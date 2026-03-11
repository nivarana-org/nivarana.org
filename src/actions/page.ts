"use server";
import { addOrEditPage } from "@/data/cms";
import { revalidatePath } from "next/cache";

export const addOrEditPageAction = async (formData: FormData) => {
    const id = formData.get("id");
    const page_name = formData.get("path");
    const page_title = formData.get("title");
    const description = formData.get("description");

    const page = {
        id: id ? Number(id) : undefined,
        page_name: page_name as string,
        page_title: page_title as string,
        description: description as string,
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
