import { addTag } from "@/data/cms";
import {
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
} from "@mui/joy";
import { redirect } from "next/navigation";

async function addTagAction(formData: FormData) {
    "use server";
    const name = formData.get("name");
    const path = formData.get("path");
    await addTag(name, path);
    redirect(`/admin/tags`);
}
export default async function Page() {
    return (
        <form action={addTagAction} className="p-2">
            <FormControl>
                <FormLabel className="font-bold">Tag Title</FormLabel>
                <Input name="name" className="text-bold"></Input>
                <FormHelperText>
                    This is the publicly visible title. Do type the # at the
                    beginning.
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
