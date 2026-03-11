"use client";
import React, { useState } from "react";
import { Button, Divider } from "@mui/joy";
import { addOrEditPageAction } from "@/actions/page";
import dynamic from "next/dynamic";

const BundledEditor = dynamic(() => import("./BundledEditor"), {
    ssr: false,
    loading: () => <p>Loading editor....</p>,
});

type Page = {
    id: number;
    page_name: string;
    page_title: string;
    description: string;
};

export default function PageEditPage({ page }: { page: Page }) {
    const [path, setPath] = useState(page.page_name || "");
    const [title, setTitle] = useState(page.page_title || "");
    const [description, setDescription] = useState(page.description || "");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        const formData = new FormData();
        formData.append("id", `${page.id}`);
        formData.append("path", path);
        formData.append("title", title);
        formData.append("description", description);
        await addOrEditPageAction(formData);
        setSaving(false);
    };

    return (
        <form
            className="p-4 max-w-4xl mx-auto flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-2">
                <label className="font-bold" htmlFor="path">
                    Path
                </label>
                <input
                    id="path"
                    type="text"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
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
                <label className="font-bold" htmlFor="description">
                    Content
                </label>
                <BundledEditor
                    apiKey="gpl"
                    value={description}
                    onEditorChange={(content: string) =>
                        setDescription(content)
                    }
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
