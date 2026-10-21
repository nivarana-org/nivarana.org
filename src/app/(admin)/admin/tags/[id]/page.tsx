import { addTag } from "./queries";
import { Button, TextField } from "@mui/material";
import { redirect } from "next/navigation";

async function addTagAction(formData: FormData) {
    "use server";
    const name = formData.get("name");
    const slug = formData.get("slug");
    await addTag(name, slug);
    redirect(`/admin/tags`);
}
export default async function Page() {
    return (
        <form action={addTagAction} className="p-2">
            <TextField
                name="name"
                label="Tag Title"
                slotProps={{ inputLabel: { className: "font-bold" } }}
                helperText="This is the publicly visible title. Examples are 'Empathy', 'Violence in health system', 'Climate Change'"
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
