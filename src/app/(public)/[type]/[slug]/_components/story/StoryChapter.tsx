import Image from "next/image";
import { getImageURLFromFileName } from "@/utils/paths";
import type { Chapter } from "@/data/story";

import { getMediaMeta, type MediaMetaMap } from "../../_lib/mediaMeta";
import ImageCredit from "../shared/ImageCredit";
import BodyWithPopover from "./BodyWithPopover";
import ZoomableImage from "./ZoomableImage";

/**
 * One chapter of a story. A story with a single chapter renders exactly like
 * an article; a story with several renders each of them in turn.
 */
export default function StoryChapter({
    chapter,
    mediaMeta,
    imageVariant = "zoom",
    bodyClassName = "",
    dropCap = false,
}: {
    chapter: Chapter;
    mediaMeta: MediaMetaMap;
    imageVariant?: "zoom" | "inline";
    bodyClassName?: string;
    dropCap?: boolean;
}) {
    const { title, body, image } = chapter;
    const imageMeta = getMediaMeta(mediaMeta, image);
    const alt = imageMeta?.altText?.trim() || title || "";
    return (
        <>
            {image ? (
                imageVariant === "zoom" ? (
                    <ZoomableImage
                        src={getImageURLFromFileName(image)}
                        alt={alt}
                        credit={<ImageCredit meta={imageMeta} />}
                    />
                ) : (
                    <div className="relative my-6">
                        <Image
                            src={getImageURLFromFileName(image)}
                            alt={alt}
                            width={2000}
                            height={1414}
                            className="w-full h-auto rounded-lg"
                        />
                        <ImageCredit meta={imageMeta} />
                    </div>
                )
            ) : null}
            {title ? (
                <div className="max-w-4xl mx-auto text-3xl font-semibold leading-snug text-nivarana-charcoal mt-10 mb-4">
                    {title}
                </div>
            ) : null}
            <BodyWithPopover
                body={body}
                mediaMeta={mediaMeta}
                className={bodyClassName}
                dropCap={dropCap}
            />
        </>
    );
}
