"use client";
import { useEffect, useState } from "react";
import {
    Button,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Option,
    Select,
    Textarea,
} from "@mui/joy";
import { addOrEditPostAction } from "@/actions/post";
import { Article } from "@/data/cms";
import { sluggify } from "@/utils/string";
import dynamic from "next/dynamic";
import ImagePicker from "./ImagePicker";

const ArticleEditor = dynamic(() => import("./ArticleEditor"), {
    ssr: false,
    loading: () => <p>Loading editor....</p>,
});

export default function ArticleEditPage({
    post,
    allAuthors,
    allCategories,
}: {
    post: Article;
    allAuthors: { id: string; author_name: string }[];
    allCategories: { id: string; name: string }[];
}) {
    const [submitting, setSubmitting] = useState(false);
    const [title, setTitle] = useState(post?.page_title || "");
    const [path, setPath] = useState(post?.path || "");
    const [generatePath, setGeneratePath] = useState(!Boolean(post?.path));
    const [pathIsReadOnly, setPathReadOnly] = useState(Boolean(post?.path));
    useEffect(() => {
        if (!generatePath) return;
        setPath(sluggify(title));
    }, [generatePath, title]);
    const [authors, setAuthors] = useState<string[]>(
        post?.authors?.split(",") ?? [],
    );
    const handleAuthorChange = (
        event: React.SyntheticEvent | null,
        newValue: Array<string> | null,
    ) => {
        if (newValue) {
            setAuthors(newValue);
        }
    };
    const [image, setImage] = useState(post?.upload_image);
    const [description, setDescription] = useState(post?.description);
    return (
        <form
            className="p-2"
            onSubmit={async (e) => {
                e.preventDefault();
                if (!image) {
                    alert("Please select image");
                    return;
                }
                const data = new FormData(e.currentTarget);
                data.append("id", `${post.id}`);
                data.append("description", description);
                data.append("authors", authors.join(","));
                data.append("image", image);
                setSubmitting(true);
                const { status, message } = await addOrEditPostAction(data);
                setSubmitting(false);
                if (!status) {
                    alert(message);
                } else {
                    setPathReadOnly(true);
                    if (
                        confirm("Post updated successfully. Open the post now?")
                    ) {
                        window.open(`/article/${path}`);
                    }
                }
            }}
        >
            <FormControl>
                <FormLabel>Post Title</FormLabel>
                <Input
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-bold"
                ></Input>
                <FormHelperText>
                    This is the publicly visible title
                </FormHelperText>
            </FormControl>
            <Divider></Divider>
            <FormControl>
                <FormLabel>Slug/Link/Path</FormLabel>
                <Input
                    readOnly={pathIsReadOnly}
                    name="path"
                    value={path}
                    onChange={(e) => {
                        setGeneratePath(false);
                        setPath(e.target.value);
                    }}
                ></Input>
                <FormHelperText>
                    {path
                        ? `The article will be publicly accessible at https://nivarana.org/article/${path}`
                        : "The link to the article"}
                </FormHelperText>
            </FormControl>

            <FormControl>
                <FormLabel>Choose the authors</FormLabel>
                <Select
                    defaultValue={authors}
                    multiple
                    placeholder="Select one or more authors"
                    onChange={handleAuthorChange}
                >
                    {allAuthors.map(
                        (a: { id: string; author_name: string }) => (
                            <Option key={a.id} value={`${a.id}`}>
                                {a.author_name}
                            </Option>
                        ),
                    )}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel>Choose the category</FormLabel>
                <Select
                    defaultValue={post?.category_name}
                    name="category"
                    placeholder="Select a category"
                    required
                >
                    {allCategories.map((c: { id: string; name: string }) => (
                        <Option key={c.id} value={`${c.id}`}>
                            {c.name}
                        </Option>
                    ))}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel>
                    Introduction paragraph (previously called &quot;Meta
                    Description&quot;
                </FormLabel>
                <Textarea
                    name="intro"
                    defaultValue={post?.meta_description}
                    minRows={4}
                ></Textarea>
            </FormControl>
            <FormControl>
                <FormLabel>Image</FormLabel>
                <ImagePicker
                    defaultValue={post?.upload_image}
                    onChange={(newValue: string) => {
                        setImage(newValue);
                    }}
                ></ImagePicker>
            </FormControl>
            <ArticleEditor
                initialValue={post?.description}
                value={description}
                onEditorChange={(newValue, editor) => setDescription(newValue)}
            />
            <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
            </Button>
        </form>
    );
}
