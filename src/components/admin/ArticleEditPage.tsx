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
import { DateTimePicker } from "@mui/x-date-pickers";
import moment from "moment";

const ArticleEditor = dynamic(() => import("./ArticleEditor"), {
    ssr: false,
    loading: () => <p>Loading editor....</p>,
});

const statuses = [
    { id: "DRAFT", name: "Draft" },
    { id: "SCHEDULED", name: "Scheduled" },
    { id: "PUBLISHED", name: "Published" },
];

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
    const [selectedStatus, setSelectedStatus] = useState(
        post?.status || "DRAFT",
    );
    const [scheduledTime, setScheduledTime] = useState(
        moment(post?.scheduled_time) || null,
    );
    const handleStatusChange = (event, newValue) => {
        setSelectedStatus(newValue);
        if (newValue !== "SCHEDULED") {
            setScheduledTime(null);
        }
    };
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
            className="p-4 max-w-screen-sm mx-auto"
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
                data.append("status", selectedStatus);
                if (selectedStatus === "SCHEDULED") {
                    data.append("scheduled_time", scheduledTime);
                }
                setSubmitting(true);
                const { status, message } = await addOrEditPostAction(data);
                setSubmitting(false);
                if (!status) {
                    alert(message);
                } else {
                    setPathReadOnly(true);
                    switch (selectedStatus) {
                        case "SCHEDULED":
                            alert(
                                `Post has been scheduled to go live ${moment(scheduledTime).fromNow()}. You can close this window.`,
                            );
                            break;
                        case "PUBLISHED":
                            if (
                                confirm(
                                    "Post updated successfully. Open the post now?",
                                )
                            ) {
                                window.open(`/article/${path}`);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }}
        >
            <FormControl>
                <FormLabel className="font-bold">Post Title</FormLabel>
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
            <Divider className="my-4"></Divider>
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

            <Divider className="my-4"></Divider>

            <FormControl>
                <FormLabel className="font-bold">Choose the authors</FormLabel>
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

            <Divider className="my-4"></Divider>

            <FormControl>
                <FormLabel className="font-bold">Choose the category</FormLabel>
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

            <Divider className="my-4"></Divider>

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

            <Divider className="my-4"></Divider>

            <FormControl>
                <FormLabel className="font-bold">Image</FormLabel>
                <ImagePicker
                    defaultValue={post?.upload_image}
                    onChange={(newValue: string) => {
                        setImage(newValue);
                    }}
                ></ImagePicker>
            </FormControl>

            <Divider className="my-4"></Divider>

            <ArticleEditor
                initialValue={post?.description}
                value={description}
                onEditorChange={(newValue) => setDescription(newValue)}
            />

            <Divider className="my-4"></Divider>

            <FormControl>
                <FormLabel className="font-bold">Status</FormLabel>
                <Select
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    name="status"
                    placeholder="Ready?"
                    required
                >
                    {statuses.map((c: { id: string; name: string }) => (
                        <Option key={c.id} value={`${c.id}`}>
                            {c.name}
                        </Option>
                    ))}
                </Select>
            </FormControl>

            {selectedStatus === "SCHEDULED" && (
                <FormControl>
                    <FormLabel className="font-bold">
                        Scheduled for time
                    </FormLabel>
                    <DateTimePicker
                        value={scheduledTime}
                        onChange={setScheduledTime}
                        renderInput={(props) => <input {...props} />}
                        required
                    />
                </FormControl>
            )}

            <Divider className="my-4"></Divider>

            <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save"}
            </Button>
            <div className="my-96"></div>
        </form>
    );
}
