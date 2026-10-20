"use client";
import { useState } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { addOrEditPostAction } from "./post";
import type { Article } from "../queries";
import dynamic from "next/dynamic";
import ImagePicker from "@/app/(admin)/admin/_components/ImagePicker";
import { DateTimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import PhotoEssayEditor from "./PhotoEssayEditor";
import { useImmerReducer } from "use-immer";
import { articleEditReducer } from "./article-edit-path-title-reducer";

const ArticleEditor = dynamic(
    () => import("@/app/(admin)/admin/articles/[id]/_components/ArticleEditor"),
    {
        ssr: false,
        loading: () => <p>Loading editor....</p>,
    },
);

const statuses = [
    { id: "DRAFT", name: "Draft" },
    { id: "SCHEDULED", name: "Scheduled" },
    { id: "PUBLISHED", name: "Published" },
];

const languages = [
    { id: "en", name: "English" },
    { id: "as", name: "Assamese" },
    { id: "bn", name: "Bengali" },
    { id: "gu", name: "Gujarati" },
    { id: "hi", name: "Hindi" },
    { id: "kn", name: "Kannada" },
    { id: "ks", name: "Kashmiri" },
    { id: "ml", name: "Malayalam" },
    { id: "mr", name: "Marathi" },
    { id: "ne", name: "Nepali" },
    { id: "or", name: "Odia" },
    { id: "pa", name: "Punjabi" },
    { id: "sa", name: "Sanskrit" },
    { id: "sd", name: "Sindhi" },
    { id: "ta", name: "Tamil" },
    { id: "te", name: "Telugu" },
    { id: "ur", name: "Urdu" },
    { id: "bh", name: "Bihari" },
    { id: "bo", name: "Bodo" },
    { id: "doi", name: "Dogri" },
    { id: "mai", name: "Maithili" },
    { id: "mni", name: "Manipuri" },
];

export default function ArticleEditPage({
    post,
    allAuthors,
    allCategories,
    allTags,
    type,
}: {
    post: Article;
    allAuthors: { id: string; name: string }[];
    allCategories: { id: string; name: string }[];
    allTags: { id: string; name: string }[];
    type: "article" | "photo-essay";
}) {
    const [submitting, setSubmitting] = useState(false);
    const [values, dispatch] = useImmerReducer(articleEditReducer, {
        title: post?.page_title || "",
        path: post?.path || "",
        pathIsReadOnly: Boolean(post?.path),
    });
    const [selectedStatus, setSelectedStatus] = useState(
        post?.status || "DRAFT",
    );
    const [scheduledTime, setScheduledTime] = useState(
        moment(post?.scheduled_time) || null,
    );
    const handleStatusChange = (event: SelectChangeEvent) => {
        const newValue = event.target.value as string;
        setSelectedStatus(newValue);
        if (newValue !== "SCHEDULED") {
            setScheduledTime(null);
        }
    };

    const [authors, setAuthors] = useState<string[]>(
        post?.authors?.map((a) => `${a.id}`) ?? [],
    );
    const handleAuthorChange = (event: SelectChangeEvent<string[]>) => {
        setAuthors(event.target.value as string[]);
    };
    const [tags, setTags] = useState<string[]>(
        post?.tags?.map((t) => `${t.id}`) ?? [],
    );
    const handleTagChange = (event: SelectChangeEvent<string[]>) => {
        setTags(event.target.value as string[]);
    };
    const [category, setCategory] = useState(post?.category_name ?? "");
    const [image, setImage] = useState(post?.upload_image);
    const [description, setDescription] = useState(
        type === "article" ? post?.description : JSON.parse(post?.description),
    );
    return (
        <form
            className="p-4 max-w-(--breakpoint-sm) mx-auto"
            onSubmit={async (e) => {
                e.preventDefault();
                if (!image) {
                    alert("Please select image");
                    return;
                }
                if (Array.isArray(tags) && tags.length === 0) {
                    alert("Please add at least one tag");
                    return;
                }
                const data = new FormData(e.currentTarget);
                data.append("id", `${post.id}`);
                data.append(
                    "description",
                    type === "article"
                        ? description
                        : JSON.stringify(description),
                );
                data.append("type", type);
                data.append("authors", authors.join(","));
                data.append("tags", JSON.stringify(tags));
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
                    dispatch({ type: "freeze-path" });
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
                                window.open(`/${type}/${values.path}`);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }}
        >
            <div className="grid grid-cols-1 gap-4">
                <TextField
                    fullWidth
                    name="title"
                    value={values.title}
                    onChange={(e) =>
                        dispatch({ type: "title", value: e.target.value })
                    }
                    label="Post Title"
                    slotProps={{ inputLabel: { className: "font-bold" } }}
                ></TextField>

                <TextField
                    fullWidth
                    slotProps={{
                        htmlInput: { readOnly: values.pathIsReadOnly },
                    }}
                    name="path"
                    value={values.path}
                    onChange={(e) => {
                        dispatch({ type: "path", value: e.target.value });
                    }}
                    label="Slug/Link/Path"
                ></TextField>

                <FormControl fullWidth>
                    <InputLabel htmlFor="authors-select" className="font-bold">
                        Choose the authors
                    </InputLabel>
                    <Select
                        id="authors-select"
                        value={authors}
                        multiple
                        label="Choose the authors"
                        onChange={handleAuthorChange}
                        renderValue={(selected) =>
                            selected
                                .map(
                                    (id) =>
                                        allAuthors.find(
                                            (a: { id: string }) =>
                                                `${a.id}` === `${id}`,
                                        )?.name ?? `${id}`,
                                )
                                .join(", ")
                        }
                    >
                        {allAuthors.map((a: { id: string; name: string }) => (
                            <MenuItem key={a.id} value={`${a.id}`}>
                                {a.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel htmlFor="category-select" className="font-bold">
                        Choose the category
                    </InputLabel>
                    <Select
                        id="category-select"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        name="category"
                        label="Choose the category"
                        required
                        renderValue={(selected) => {
                            const category = allCategories.find(
                                (c: { id: string }) =>
                                    `${c.id}` === `${selected}`,
                            );
                            return category ? category.name : `${selected}`;
                        }}
                    >
                        {allCategories.map(
                            (c: { id: string; name: string }) => (
                                <MenuItem key={c.id} value={`${c.id}`}>
                                    {c.name}
                                </MenuItem>
                            ),
                        )}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel htmlFor="hashtags-select" className="font-bold">
                        Choose the hashtags
                    </InputLabel>
                    <Select
                        id="hashtags-select"
                        value={tags}
                        onChange={handleTagChange}
                        multiple
                        label="Choose the hashtags"
                        renderValue={(selected) =>
                            selected
                                .map(
                                    (id) =>
                                        allTags.find(
                                            (t: { id: string }) =>
                                                `${t.id}` === `${id}`,
                                        )?.name ?? `${id}`,
                                )
                                .join(", ")
                        }
                    >
                        {allTags.map((t: { id: string; name: string }) => (
                            <MenuItem key={t.id} value={`${t.id}`}>
                                {t.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    name="intro"
                    defaultValue={post?.meta_description}
                    label={
                        <>
                            Introduction paragraph (previously called &quot;Meta
                            Description&quot;
                        </>
                    }
                    multiline
                    minRows={4}
                ></TextField>

                <FormControl fullWidth>
                    <FormLabel className="font-bold">Image</FormLabel>
                    <ImagePicker
                        defaultValue={image}
                        onChange={(newValue: string) => {
                            setImage(newValue);
                        }}
                    ></ImagePicker>
                </FormControl>

                {type === "article" ? (
                    <ArticleEditor
                        initialValue={post?.description}
                        value={description}
                        onEditorChange={(newValue) => setDescription(newValue)}
                    />
                ) : (
                    <PhotoEssayEditor
                        value={description}
                        onEditorChange={(newValue) => setDescription(newValue)}
                    />
                )}

                <FormControl fullWidth>
                    <InputLabel htmlFor="language-select" className="font-bold">
                        Language
                    </InputLabel>
                    <Select
                        id="language-select"
                        defaultValue={post?.language || "en"}
                        name="language"
                        label="Language"
                        displayEmpty
                        required
                        renderValue={(selected) => {
                            if (!selected) {
                                return <em>Select a language</em>;
                            }
                            return (
                                languages.find((l) => l.id === selected)
                                    ?.name ?? `${selected}`
                            );
                        }}
                    >
                        {languages.map((l) => (
                            <MenuItem key={l.id} value={l.id}>
                                {l.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel htmlFor="status-select" className="font-bold">
                        Status
                    </InputLabel>
                    <Select
                        id="status-select"
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        name="status"
                        label="Status"
                        displayEmpty
                        required
                        renderValue={(selected) => {
                            if (!selected) {
                                return <em>Ready?</em>;
                            }
                            return (
                                statuses.find((s) => s.id === selected)?.name ??
                                `${selected}`
                            );
                        }}
                    >
                        {statuses.map((c: { id: string; name: string }) => (
                            <MenuItem key={c.id} value={`${c.id}`}>
                                {c.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {selectedStatus === "SCHEDULED" && (
                    <FormControl fullWidth>
                        <FormLabel className="font-bold">
                            Scheduled for time
                        </FormLabel>
                        <DateTimePicker
                            value={scheduledTime}
                            onChange={setScheduledTime}
                            required
                        />
                    </FormControl>
                )}

                <div>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>
            <div className="my-96"></div>
        </form>
    );
}
