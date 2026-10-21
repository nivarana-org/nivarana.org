"use client";

import { useState } from "react";
import { Button, FormControl, FormLabel, TextField } from "@mui/material";

import type { Chapter } from "@/data/story";
import ImagePicker from "@/app/(admin)/admin/_components/ImagePicker";

import ArticleEditor from "./ArticleEditor";

const emptyChapter = (): Chapter => ({ title: "", body: "", image: null });

/**
 * The editor for a story.
 *
 * A story is a list of chapters. Only the chapter that is open has a rich
 * text editor mounted, so a story with fifteen chapters costs one editor, not
 * fifteen.
 */
export default function StoryEditor({
    chapters,
    onChange,
}: {
    chapters: Chapter[];
    onChange: (updater: (previous: Chapter[]) => Chapter[]) => void;
}) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    // A chapter that was given a title or an image keeps them, even when
    // the chapter is the first one.
    const [extras, setExtras] = useState<
        Record<number, { title?: boolean; image?: boolean }>
    >({});

    const revealExtra = (index: number, extra: "title" | "image") => {
        setExtras((previous) => ({
            ...previous,
            [index]: { ...previous[index], [extra]: true },
        }));
    };

    const updateChapter = (index: number, update: Partial<Chapter>) => {
        onChange((previous) =>
            previous.map((chapter, i) =>
                i === index ? { ...chapter, ...update } : chapter,
            ),
        );
    };

    const addChapter = () => {
        onChange((previous) => [...previous, emptyChapter()]);
        setOpenIndex(chapters.length);
    };

    const deleteChapter = (index: number) => {
        if (!confirm("Delete this chapter?")) {
            return;
        }
        onChange((previous) => {
            const next = previous.filter((_, i) => i !== index);
            return next.length > 0 ? next : [emptyChapter()];
        });
        setOpenIndex(null);
    };

    const moveChapter = (index: number, delta: number) => {
        onChange((previous) => {
            const target = index + delta;
            if (target < 0 || target >= previous.length) {
                return previous;
            }
            const next = [...previous];
            const [moved] = next.splice(index, 1);
            next.splice(target, 0, moved);
            return next;
        });
    };

    const duplicateChapter = (index: number) => {
        onChange((previous) => {
            const next = [...previous];
            next.splice(index + 1, 0, {
                ...previous[index],
                title: "",
                image: null,
            });
            return next;
        });
        setOpenIndex(index + 1);
    };

    return (
        <div className="flex flex-col gap-2">
            {chapters.map((chapter, index) => {
                const isOpen = openIndex === index;
                // The first chapter is the lead text under the cover, so it
                // carries no title and no image of its own. A chapter that
                // already has one keeps it and stays editable.
                const showTitle =
                    index > 0 ||
                    Boolean(chapter.title) ||
                    Boolean(extras[index]?.title);
                const showImage =
                    index > 0 ||
                    Boolean(chapter.image) ||
                    Boolean(extras[index]?.image);
                return (
                    <div key={index} className="border rounded p-2">
                        <div className="flex items-start justify-between gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setOpenIndex(isOpen ? null : index)
                                }
                                className="text-left grow"
                            >
                                <span className="font-bold">
                                    Chapter {index + 1}
                                </span>
                                <span className="block text-sm text-gray-600">
                                    {chapter.title ||
                                        (index === 0
                                            ? "Introduction"
                                            : "Untitled chapter")}
                                </span>
                            </button>
                            <div className="flex gap-1 flex-wrap justify-end">
                                <Button
                                    size="small"
                                    onClick={() => moveChapter(index, -1)}
                                    disabled={index === 0}
                                >
                                    Move up
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => moveChapter(index, 1)}
                                    disabled={index === chapters.length - 1}
                                >
                                    Move down
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => duplicateChapter(index)}
                                >
                                    Duplicate
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => deleteChapter(index)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                        {isOpen ? (
                            <div className="mt-2 flex flex-col gap-2">
                                {showTitle ? (
                                    <TextField
                                        label="Chapter Title"
                                        multiline
                                        minRows={2}
                                        value={chapter.title}
                                        onChange={(e) => {
                                            revealExtra(index, "title");
                                            updateChapter(index, {
                                                title: e.target.value,
                                            });
                                        }}
                                    ></TextField>
                                ) : null}
                                <FormControl>
                                    <FormLabel>Chapter Body</FormLabel>
                                    <ArticleEditor
                                        value={chapter.body}
                                        onEditorChange={(newValue) =>
                                            updateChapter(index, {
                                                body: newValue,
                                            })
                                        }
                                    />
                                </FormControl>
                                {showImage ? (
                                    <FormControl>
                                        <FormLabel className="font-bold">
                                            Image
                                        </FormLabel>
                                        <ImagePicker
                                            defaultValue={chapter.image ?? ""}
                                            onChange={(newValue: string) => {
                                                revealExtra(index, "image");
                                                updateChapter(index, {
                                                    image: newValue,
                                                });
                                            }}
                                        ></ImagePicker>
                                    </FormControl>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                );
            })}
            <div className="mt-4">
                <Button onClick={addChapter}>Add Chapter</Button>
            </div>
        </div>
    );
}
