"use client";
import { useState } from "react";
import ArticleEditor from "./ArticleEditor";
import {
    Button,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Option,
    Select,
} from "@mui/joy";
import { addOrEditPostAction } from "@/actions/post";
import { Article } from "@/data/cms";

export default function ArticleEditPage({
    post,
    allAuthors,
}: {
    post: Article;
}) {
    const [title, setTitle] = useState(post?.page_title || "");
    const [path, setPath] = useState(post?.path || "");
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
    const [description, setDescription] = useState(post?.description);
    return (
        <form
            className="p-2"
            onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                data.append("id", `${post.id}`);
                data.append("description", description);
                data.append("authors", authors.join(","));
                addOrEditPostAction(data);
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
                    readOnly={Boolean(post?.path)}
                    name="path"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
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
            <ArticleEditor
                initialValue={post?.description}
                value={description}
                onEditorChange={(newValue, editor) => setDescription(newValue)}
            />
            <Button type="submit">Submit</Button>
        </form>
    );
}
