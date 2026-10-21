"use client";
import { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { addOrEditPostAction } from "./post";
import { addTagAction } from "./tag-actions";
import type { EditablePost } from "../queries";
import ImagePicker from "@/app/(admin)/admin/_components/ImagePicker";
import { DateTimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import type { Moment } from "moment";
import StoryEditor from "./StoryEditor";
import { useImmerReducer } from "use-immer";
import { articleEditReducer } from "./article-edit-title-slug-reducer";
import {
    CONTINUOUS_LAYOUT,
    PAGED_LAYOUT,
    deriveLayout,
    ensureChapter,
    isPostLayout,
    parseStory,
    serializeStory,
    type Chapter,
    type PostLayout,
} from "@/data/story";

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
    allTags: initialAllTags,
}: {
    post: EditablePost;
    allAuthors: { id: number; name: string }[];
    allCategories: { id: number; name: string }[];
    allTags: { id: number; name: string }[];
}) {
    const [submitting, setSubmitting] = useState(false);
    const [values, dispatch] = useImmerReducer(articleEditReducer, {
        title: post?.title || "",
        slug: post?.slug || "",
        slugIsReadOnly: Boolean(post?.slug),
    });
    const [selectedStatus, setSelectedStatus] = useState(
        post?.status || "DRAFT",
    );
    const [scheduledTime, setScheduledTime] = useState<Moment | null>(
        post?.published_at ? moment(post.published_at) : null,
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
    const [allTags, setAllTags] = useState(initialAllTags);
    const handleTagChange = (event: SelectChangeEvent<string[]>) => {
        setTags(event.target.value as string[]);
    };
    const [newTagOpen, setNewTagOpen] = useState(false);
    const [newTagSubmitting, setNewTagSubmitting] = useState(false);
    const [newTag, newTagDispatch] = useImmerReducer(articleEditReducer, {
        title: "",
        slug: "",
        slugIsReadOnly: false,
    });
    const handleCreateTag = async () => {
        const name = newTag.title.trim();
        const slug = newTag.slug.trim();
        if (!name) {
            alert("Please enter a tag name");
            return;
        }
        if (!slug) {
            alert("Please enter a tag slug");
            return;
        }
        if (
            allTags.some(
                (t) => `${t.name}`.toLowerCase() === name.toLowerCase(),
            )
        ) {
            alert("A tag with this name already exists");
            return;
        }
        setNewTagSubmitting(true);
        const { status, message, data } = await addTagAction(name, slug);
        setNewTagSubmitting(false);
        if (!status || !data) {
            alert(message);
            return;
        }
        setAllTags((prev) =>
            [...prev, { ...data }].sort((a, b) => a.name.localeCompare(b.name)),
        );
        setTags((prev) => [...prev, `${data.id}`]);
        newTagDispatch({ type: "reset" });
        setNewTagOpen(false);
    };
    const [category, setCategory] = useState(post?.category?.[0]?.id ?? "");
    const [image, setImage] = useState(post?.image);
    const [chapters, setChapters] = useState<Chapter[]>(
        ensureChapter(parseStory(post?.contents).chapters),
    );
    // The layout of a story follows its number of chapters: one chapter reads
    // as an article, several read as a photo essay. `layoutChoice` holds the
    // layout the author picked by hand, which wins over the derived one. A
    // stored layout that differs from the derived one is the author's own
    // choice from an earlier session, so it is picked up the same way.
    const [layoutChoice, setLayoutChoice] = useState<PostLayout | null>(() => {
        const stored = post?.layout;
        if (!isPostLayout(stored)) {
            return null;
        }
        return stored === deriveLayout(chapters.length) ? null : stored;
    });
    const layout = layoutChoice ?? deriveLayout(chapters.length);

    const handleChaptersChange = (
        updater: (previous: Chapter[]) => Chapter[],
    ) => {
        setChapters(updater);
    };

    const handleLayoutChange = (event: SelectChangeEvent) => {
        setLayoutChoice(event.target.value as PostLayout);
    };
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
                data.append("contents", serializeStory(chapters));
                data.append("layout", layout);
                data.append("authors", authors.join(","));
                data.append("tags", JSON.stringify(tags));
                data.append("image", image);
                data.append("status", selectedStatus);
                if (selectedStatus === "SCHEDULED" && scheduledTime) {
                    data.append("published_at", scheduledTime.toISOString());
                }
                setSubmitting(true);
                const { status, message } = await addOrEditPostAction(data);
                setSubmitting(false);
                if (!status) {
                    alert(message);
                } else {
                    dispatch({ type: "freeze-slug" });
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
                                const categorySlug = post?.category?.[0]?.slug;
                                if (categorySlug) {
                                    window.open(
                                        `/${categorySlug}/${values.slug}`,
                                    );
                                }
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
                        htmlInput: { readOnly: values.slugIsReadOnly },
                    }}
                    name="slug"
                    value={values.slug}
                    onChange={(e) => {
                        dispatch({ type: "slug", value: e.target.value });
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
                                            (a) => `${a.id}` === `${id}`,
                                        )?.name ?? `${id}`,
                                )
                                .join(", ")
                        }
                    >
                        {allAuthors.map((a) => (
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
                                (c) => `${c.id}` === `${selected}`,
                            );
                            return category ? category.name : `${selected}`;
                        }}
                    >
                        {allCategories.map((c) => (
                            <MenuItem key={c.id} value={`${c.id}`}>
                                {c.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel htmlFor="tags-select" className="font-bold">
                        Choose the tags
                    </InputLabel>
                    <Select
                        id="tags-select"
                        value={tags}
                        onChange={handleTagChange}
                        multiple
                        label="Choose the tags"
                        renderValue={(selected) =>
                            selected
                                .map(
                                    (id) =>
                                        allTags.find(
                                            (t) => `${t.id}` === `${id}`,
                                        )?.name ?? `${id}`,
                                )
                                .join(", ")
                        }
                    >
                        {allTags.map((t) => (
                            <MenuItem key={t.id} value={`${t.id}`}>
                                {t.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button
                        size="small"
                        onClick={() => {
                            newTagDispatch({ type: "reset" });
                            setNewTagOpen(true);
                        }}
                        className="justify-start mt-1"
                    >
                        + Add new tag
                    </Button>
                </FormControl>

                <TextField
                    fullWidth
                    name="intro"
                    defaultValue={post?.intro}
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
                        defaultValue={image ?? ""}
                        onChange={(newValue: string) => {
                            setImage(newValue);
                        }}
                    ></ImagePicker>
                </FormControl>

                <StoryEditor
                    chapters={chapters}
                    onChange={handleChaptersChange}
                />

                <FormControl fullWidth>
                    <InputLabel htmlFor="layout-select" className="font-bold">
                        Layout
                    </InputLabel>
                    <Select
                        id="layout-select"
                        value={layout}
                        onChange={handleLayoutChange}
                        label="Layout"
                        displayEmpty
                        required
                        renderValue={(selected) =>
                            selected === PAGED_LAYOUT
                                ? "Paged (photo essay)"
                                : "Continuous (article)"
                        }
                    >
                        <MenuItem value={CONTINUOUS_LAYOUT}>
                            Continuous (article)
                        </MenuItem>
                        <MenuItem value={PAGED_LAYOUT}>
                            Paged (photo essay)
                        </MenuItem>
                    </Select>
                    <p className="text-xs text-gray-600 mt-1">
                        A story with one chapter reads as an article, a story
                        with several reads as a photo essay. Choose a layout to
                        override that.
                    </p>
                </FormControl>

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
                            onChange={(value) => setScheduledTime(value)}
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
            <Dialog
                open={newTagOpen}
                onClose={() => setNewTagOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add a new tag</DialogTitle>
                <DialogContent>
                    <div className="grid grid-cols-1 gap-4 pt-2">
                        <TextField
                            fullWidth
                            autoFocus
                            value={newTag.title}
                            onChange={(e) =>
                                newTagDispatch({
                                    type: "title",
                                    value: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleCreateTag();
                                }
                            }}
                            label="Tag Title"
                            slotProps={{
                                inputLabel: { className: "font-bold" },
                            }}
                            helperText="This is the publicly visible title. Do type the # at the beginning."
                        ></TextField>
                        <TextField
                            fullWidth
                            value={newTag.slug}
                            onChange={(e) =>
                                newTagDispatch({
                                    type: "slug",
                                    value: e.target.value,
                                })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleCreateTag();
                                }
                            }}
                            label="Slug/Link/Path"
                            slotProps={{
                                inputLabel: { className: "font-bold" },
                            }}
                            helperText="Generated automatically from the tag title. You can edit it manually."
                        ></TextField>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewTagOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleCreateTag}
                        disabled={newTagSubmitting}
                    >
                        {newTagSubmitting ? "Adding..." : "Add tag"}
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
}
