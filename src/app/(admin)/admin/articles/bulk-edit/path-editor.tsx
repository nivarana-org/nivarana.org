"use client";

import { changeArticlePath } from "@/data/cms";
import { sluggify } from "@/utils/string";
import { Button } from "@mui/joy";
import Link from "next/link";
import { useState } from "react";

type Props = {
    id: string;
    title: string;
    path: string;
};

export function PathEditor({ id, title, path }: Props) {
    const [originalPath, setOriginalPath] = useState(path);
    const [currentPath, setPath] = useState(path);
    return (
        <div>
            <Link href={`/admin/articles/${id}`}>{title}</Link>
            <div>{originalPath}</div>

            <input
                value={currentPath}
                onChange={(e) => setPath(e.target.value)}
                size={100}
                type="text"
            ></input>
            <Button
                onClick={() => {
                    setPath(sluggify(title));
                }}
            >
                Sluggify
            </Button>
            <Button
                onClick={() => {
                    changeArticlePath(originalPath, currentPath);
                    setOriginalPath(currentPath);
                }}
            >
                Save
            </Button>
            <hr className="mb-2" />
        </div>
    );
}
