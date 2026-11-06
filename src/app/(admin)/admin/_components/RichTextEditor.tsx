"use client";

import dynamic from "next/dynamic";

const BundledEditor = dynamic(() => import("./BundledEditor"), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
});

type Props = {
    value: string;
    onChange: (value: string) => void;
    height?: number;
};

/**
 * A compact rich text editor for short HTML fields such as media credits and
 * article footnotes.
 */
export default function RichTextEditor({
    value,
    onChange,
    height = 320,
}: Props) {
    return (
        <BundledEditor
            apiKey="gpl"
            value={value}
            onEditorChange={onChange}
            init={{
                height,
                menubar: false,
                plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "charmap",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "table",
                    "help",
                    "wordcount",
                ],
                toolbar:
                    "undo redo | " +
                    "bold italic underline | " +
                    "alignleft aligncenter alignright | " +
                    "bullist numlist outdent indent | " +
                    "link unlink | " +
                    "removeformat code help",
                toolbar_mode: "wrap",
                promotion: false,
            }}
        />
    );
}
