"use client";
import { useState } from "react";
import {
    Button,
    Divider,
    FormControl,
    FormLabel,
    TextField,
} from "@mui/material";
import type { Author } from "../queries";
import { sluggify } from "@/utils/string";
import dynamic from "next/dynamic";
import ImagePicker from "@/app/(admin)/admin/_components/ImagePicker";
import { addOrEditAuthorAction } from "../actions";

const ArticleEditor = dynamic(
    () => import("@/app/(admin)/admin/articles/[id]/_components/ArticleEditor"),
    {
        ssr: false,
        loading: () => <p>Loading editor....</p>,
    },
);

export default function AuthorEditPage({ author }: { author: Author }) {
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState(author?.name || "");
    const [email, setEmail] = useState(author?.email || "");

    const [fixedSlug, setFixedSlug] = useState(author?.slug);
    const [manualSlug, setManualSlug] = useState("");

    const slug = fixedSlug || manualSlug || sluggify(name);

    const [image, setImage] = useState(author?.image ?? "");
    const [description, setDescription] = useState(author?.description ?? "");
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
                    setFixedSlug(slug);
                    if (
                        confirm(
                            "Author updated successfully. Open the public page now?",
                        )
                    ) {
                        window.open(`/author/${slug}`);
                    }
                }
            }}
        >
            <TextField
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                label="Author Name"
                slotProps={{ inputLabel: { className: "font-bold" } }}
                helperText="This is the publicly visible name"
            ></TextField>

            <Divider className="my-4"></Divider>
            <TextField
                name="email"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                label="Author Email"
                slotProps={{ inputLabel: { className: "font-bold" } }}
                helperText="Email will be publicly visible. Ensure consent?"
            ></TextField>

            <Divider className="my-4"></Divider>
            <TextField
                slotProps={{
                    htmlInput: { readOnly: Boolean(fixedSlug) },
                }}
                name="slug"
                value={slug}
                onChange={(e) => {
                    setManualSlug(e.target.value);
                }}
                label="Slug/Link/Path"
                helperText={
                    slug
                        ? `The author's profile will be publicly accessible at https://nivarana.org/author/${slug}`
                        : "The link to the author's profile"
                }
            ></TextField>

            <Divider className="my-4"></Divider>

            <TextField
                name="intro"
                defaultValue={author?.title}
                label="Title"
                multiline
                minRows={4}
            ></TextField>

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
                initialValue={author?.description ?? ""}
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
