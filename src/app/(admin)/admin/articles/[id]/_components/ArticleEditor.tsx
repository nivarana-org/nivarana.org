"use client";
import { useRef } from "react";
import dynamic from "next/dynamic";

import type { BlobInfo, Editor as TinyMCEEditor } from "tinymce";

const BundledEditor = dynamic(
    () => import("../../../_components/BundledEditor"),
    { ssr: false },
);

type Props = {
    initialValue?: string;
    value: string;
    /** Called with the new contents every time the editor changes. */
    onEditorChange?: (value: string) => void;
};

export default function ArticleEditor(props: Props) {
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const imageUploadHandler = async (blobInfo: BlobInfo) => {
        const formData = new FormData();
        formData.append("file", blobInfo.blob(), blobInfo.filename());
        const result = await fetch("/admin/api/images/upload", {
            body: formData,
            method: "post",
        });
        const data = await result.json();
        return data.link;
    };
    return (
        <>
            <BundledEditor
                apiKey="gpl"
                onInit={(_evt, editor) => {
                    editorRef.current = editor;
                }}
                init={{
                    height: 600,
                    menubar: true,
                    plugins: [
                        "advlist",
                        "autolink",
                        "autoresize",
                        "dfn",
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
                        "undo redo styles " +
                        "bold italic forecolor alignleft aligncenter " +
                        "alignright alignjustify bullist numlist outdent indent " +
                        "link image hr anchor dfn " +
                        "removeformat help",
                    toolbar_mode: "wrap",
                    toolbar_sticky: true,
                    min_height: 600,
                    images_upload_url: "/admin/api/images/upload",
                    automatic_uploads: true,
                    promotion: false,
                    images_upload_handler: imageUploadHandler,
                }}
                {...props}
            />
        </>
    );
}
