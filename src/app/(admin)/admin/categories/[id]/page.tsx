import { addCategory } from "@/data/cms";
import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
} from "@mui/joy";
import { redirect } from "next/navigation";

async function addCategoryAction(formData: FormData) {
    "use server";
    const name = formData.get("name");
    const path = formData.get("path");
    await addCategory(name, path);
    redirect(`/admin/categories`);
}
export default async function Page() {
    return (
        <form action={addCategoryAction} className="p-2">
            <FormControl>
                <FormLabel className="font-bold">Category Title</FormLabel>
                <Input name="name" className="text-bold"></Input>
                <FormHelperText>
                    This is the publicly visible title
                </FormHelperText>
            </FormControl>
            <FormControl>
                <FormLabel className="font-bold">Path</FormLabel>
                <Input name="path" className="text-bold"></Input>
                <FormHelperText>
                    This is the path segment visible in the URL. Should be all
                    small letters, no space, use hyphens if necessary.
                </FormHelperText>
            </FormControl>
            <Button type="submit">Save</Button>
        </form>
    );
}
