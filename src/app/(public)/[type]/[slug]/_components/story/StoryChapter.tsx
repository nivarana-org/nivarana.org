import Image from "next/image";
import { getImageURLFromFileName } from "@/utils/paths";
import type { Chapter } from "@/data/story";

import BodyWithPopover from "./BodyWithPopover";
import ZoomableImage from "./ZoomableImage";

/**
 * One chapter of a story. A story with a single chapter renders exactly like
 * an article; a story with several renders each of them in turn.
 */
export default function StoryChapter({
    chapter,
    imageVariant = "zoom",
    bodyClassName = "",
}: {
    chapter: Chapter;
    imageVariant?: "zoom" | "inline";
    bodyClassName?: string;
}) {
    const { title, body, image } = chapter;
    return (
        <>
            {image ? (
                imageVariant === "zoom" ? (
                    <ZoomableImage
                        src={getImageURLFromFileName(image)}
                        alt={title}
                    />
                ) : (
                    <Image
                        src={getImageURLFromFileName(image)}
                        alt={title || ""}
                        width={2000}
                        height={1414}
                        className="w-full h-auto rounded-lg my-6"
                    />
                )
            ) : null}
            {title ? (
                <div className="max-w-4xl mx-auto text-3xl font-semibold leading-snug text-nivarana-charcoal mt-10 mb-4">
                    {title}
                </div>
            ) : null}
            <BodyWithPopover body={body} className={bodyClassName} />
        </>
    );
}
