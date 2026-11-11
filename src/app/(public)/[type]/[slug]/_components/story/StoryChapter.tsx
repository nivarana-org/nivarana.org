import Image from "next/image";
import { getImageURLFromFileName } from "@/utils/paths";
import type { Chapter } from "@/data/story";

import { getMediaCredit, type MediaCreditMap } from "../../_lib/mediaCredits";
import ImageCredit from "../shared/ImageCredit";
import BodyWithPopover from "./BodyWithPopover";
import ZoomableImage from "./ZoomableImage";

/**
 * One chapter of a story. A story with a single chapter renders exactly like
 * an article; a story with several renders each of them in turn.
 */
export default function StoryChapter({
    chapter,
    credits,
    imageVariant = "zoom",
    bodyClassName = "",
    dropCap = false,
}: {
    chapter: Chapter;
    credits: MediaCreditMap;
    imageVariant?: "zoom" | "inline";
    bodyClassName?: string;
    dropCap?: boolean;
}) {
    const { title, body, image } = chapter;
    const credit = getMediaCredit(credits, image);
    return (
        <>
            {image ? (
                imageVariant === "zoom" ? (
                    <ZoomableImage
                        src={getImageURLFromFileName(image)}
                        alt={title}
                        credit={<ImageCredit credit={credit} />}
                    />
                ) : (
                    <div className="relative my-6">
                        <Image
                            src={getImageURLFromFileName(image)}
                            alt={title || ""}
                            width={2000}
                            height={1414}
                            className="w-full h-auto rounded-lg"
                        />
                        <ImageCredit credit={credit} />
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
                credits={credits}
                className={bodyClassName}
                dropCap={dropCap}
            />
        </>
    );
}
