'use client';
import { useRef } from 'react';
import BundledEditor from './BundledEditor'

type Props = {
    initialValue?: string
}

export default function ArticleEditor({initialValue}: Props) {
    const editorRef = useRef(null);
    const publish = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };
    const imageUploadHandler = async (blobInfo, progress, failure) =>{
        const formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        const result = await fetch('/admin/api/image-upload', {body: formData, method: 'post'});
        const data = await result.json();
        return data.link;
    }
    return (
        <>
            <BundledEditor
                apiKey='gpl'
                onInit={(_evt, editor) => editorRef.current = editor}
                initialValue={initialValue}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'link image | ' +
                        'removeformat | help',
                    images_upload_url: '/admin/api/image-upload',
                    automatic_uploads: true,
                    images_upload_handler: imageUploadHandler,
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
            <button onClick={publish}>Save</button>
        </>
    );
}