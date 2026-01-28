"use client";
import { useState } from "react";
import {
    Button,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Textarea,
} from "@mui/joy";
import { Author } from "@/data/cms";
import { sluggify } from "@/utils/string";
import dynamic from "next/dynamic";
import ImagePicker from "./ImagePicker";
import { addOrEditAuthorAction } from "@/actions/author";

const ArticleEditor = dynamic(() => import("./ArticleEditor"), {
    ssr: false,
    loading: () => <p>Loading editor....</p>,
});

export default function AuthorEditPage({ author }: { author: Author }) {
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState(author?.name || "");
    const [email, setEmail] = useState(author?.email || "");

    const [fixedPath, setFixedPath] = useState(author?.path);
    const [manualPath, setManualPath] = useState("");

    const path = fixedPath || manualPath || sluggify(name);

    const [image, setImage] = useState(author?.image);
    const [description, setDescription] = useState(author?.description);
    return (
        <form
            className="p-4 max-w-(--breakpoint-sm) mx-auto"
            onSubmit={async (e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                data.append("id", `${author.id}`);
                data.append("description", description);
                data.append("image", image);
                data.append("email", email);
                setSubmitting(true);
                const { status, message } = await addOrEditAuthorAction(data);
                setSubmitting(false);
                if (!status) {
                    alert(message);
                } else {
                    setFixedPath(path);
                    if (
                        confirm(
                            "Author updated successfully. Open the public page now?",
                        )
                    ) {
                        window.open(`/author/${path}`);
                    }
                }
            }}
        >
            <FormControl>
                <FormLabel className="font-bold">Author Name</FormLabel>
                <Input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-bold"
                ></Input>
                <FormHelperText>
                    This is the publicly visible name
                </FormHelperText>
            </FormControl>

            <Divider className="my-4"></Divider>
            <FormControl>
                <FormLabel className="font-bold">Author Email</FormLabel>
                <Input
                    name="email"
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-bold"
                ></Input>
                <FormHelperText>
                    Email will be publicly visible. Ensure consent?
                </FormHelperText>
            </FormControl>

            <Divider className="my-4"></Divider>
            <FormControl>
                <FormLabel>Slug/Link/Path</FormLabel>
                <Input
                    readOnly={Boolean(fixedPath)}
                    name="path"
                    value={path}
                    onChange={(e) => {
                        setManualPath(e.target.value);
                    }}
                ></Input>
                <FormHelperText>
                    {path
                        ? `The author's profile will be publicly accessible at https://nivarana.org/author/${path}`
                        : "The link to the author's profile"}
                </FormHelperText>
            </FormControl>

            <Divider className="my-4"></Divider>

            <FormControl>
                <FormLabel>Title</FormLabel>
                <Textarea
                    name="intro"
                    defaultValue={author?.title}
                    minRows={4}
                ></Textarea>
            </FormControl>

            <Divider className="my-4"></Divider>

            <FormControl>
                <FormLabel className="font-bold">Image</FormLabel>
                <ImagePicker
                    defaultValue={author?.image || "author.png"}
                    onChange={(newValue: string) => {
                        setImage(newValue);
                    }}
                ></ImagePicker>
            </FormControl>

            <Divider className="my-4"></Divider>

            <ArticleEditor
                initialValue={author?.description}
                value={description}
                onEditorChange={(newValue) => setDescription(newValue)}
            />

            <Divider className="my-4"></Divider>

            <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
            </Button>
            <div className="my-96"></div>
        </form>
    );
}
