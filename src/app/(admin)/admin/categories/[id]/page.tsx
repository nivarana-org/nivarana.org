import { addCategory } from "./queries";
import { Button, TextField } from "@mui/material";
import { redirect } from "next/navigation";

async function addCategoryAction(formData: FormData) {
    "use server";
    const name = formData.get("name");
    const slug = formData.get("slug");
    await addCategory(String(name ?? ""), String(slug ?? ""));
    redirect(`/admin/categories`);
}
export default async function Page() {
    return (
        <form action={addCategoryAction} className="p-2">
            <TextField
                name="name"
                label="Category Title"
                slotProps={{ inputLabel: { className: "font-bold" } }}
                helperText="This is the publicly visible title"
            ></TextField>
            <TextField
                name="slug"
                label="Slug"
                slotProps={{ inputLabel: { className: "font-bold" } }}
                helperText="This is the path segment visible in the URL. Should be all small letters, no space, use hyphens if necessary."
            ></TextField>
            <Button type="submit">Save</Button>
        </form>
    );
}
