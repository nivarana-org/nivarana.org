"use client";
import React, { useState } from "react";
import { Button, Divider } from "@mui/material";
import { addOrEditPageAction } from "../actions";
import dynamic from "next/dynamic";

const BundledEditor = dynamic(
    () => import("../../../_components/BundledEditor"),
    {
        ssr: false,
        loading: () => <p>Loading editor....</p>,
    },
);

type Page = {
    id: number;
    slug: string;
    title: string;
    contents: string;
};

export default function PageEditPage({ page }: { page: Page }) {
    const [slug, setSlug] = useState(page.slug || "");
    const [title, setTitle] = useState(page.title || "");
    const [contents, setContents] = useState(page.contents || "");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData();
        formData.append("id", `${page.id}`);
        formData.append("slug", slug);
        formData.append("title", title);
        formData.append("contents", contents);
        await addOrEditPageAction(formData);
        setSaving(false);
    };

    return (
        <form
            className="p-4 max-w-4xl mx-auto flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="slug">
                    Slug
                </label>
                <input
                    id="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                    placeholder="e.g., about-us"
                />
            </div>
            <Divider />
            <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="title">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                    placeholder="Page Title"
                />
            </div>
            <Divider />
            <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="contents">
                    Content
                </label>
                <BundledEditor
                    apiKey="gpl"
                    value={contents}
                    onEditorChange={(content: string) => setContents(content)}
                    init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                            "advlist",
                            "autolink",
                            "autoresize",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                        ],
                        toolbar:
                            "undo redo blocks " +
                            "bold italic forecolor alignleft aligncenter " +
                            "alignright alignjustify bullist numlist outdent indent " +
                            "link image hr anchor " +
                            "removeformat help",
                        toolbar_mode: "wrap",
                        toolbar_sticky: true,
                        min_height: 500,
                        promotion: false,
                    }}
                />
            </div>
            <Divider />
            <Button type="submit" loading={saving}>
                Save Page
            </Button>
        </form>
    );
}
