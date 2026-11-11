import parse, {
    attributesToProps,
    domToReact,
    Element,
} from "html-react-parser";
import Image from "next/image";
import { type ReactNode } from "react";
import { imageConfig } from "@/config/images.mjs";
import { DfnWithPopover } from "../_components/shared/DfnWithPopover";
import ImageCredit from "../_components/shared/ImageCredit";
import { getImageURLFromFileName, RELATIVE_IMAGE_PREFIX } from "@/utils/paths";
import { getMediaMeta, hasImageCredit, type MediaMetaMap } from "./mediaMeta";

function matchHostname(hostname: string, pattern: string): boolean {
    if (pattern.startsWith("**.")) {
        const suffix = pattern.slice(2);
        return hostname.endsWith(suffix);
    }
    return hostname === pattern;
}

function isImageUrlAllowed(url: string): boolean {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        return imageConfig.remotePatterns.some((pattern) => {
            if (pattern.protocol) {
                if (urlObj.protocol !== `${pattern.protocol}:`) {
                    return false;
                }
            }
            return matchHostname(hostname, pattern.hostname);
        });
    } catch {
        return false;
    }
}

function parseUrl(url: string): string {
    if (url.startsWith(RELATIVE_IMAGE_PREFIX)) {
        return getImageURLFromFileName(url.slice(RELATIVE_IMAGE_PREFIX.length));
    }
    return url;
}

export function parseHtml(
    html: string,
    mediaMeta: MediaMetaMap = {},
): ReactNode {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
        replace(domNode: Element) {
            if (domNode.name === "img" && domNode.attribs) {
                const { src, alt, ...rest } = domNode.attribs;

                if (!src) {
                    return;
                }

                const parsedUrl = parseUrl(src);
                const props = attributesToProps(rest);
                const imageMeta = getMediaMeta(mediaMeta, src);
                const imageAlt = imageMeta?.altText?.trim() || alt || "";

                if (isImageUrlAllowed(parsedUrl)) {
                    const image = (
                        <Image
                            src={parsedUrl}
                            alt={imageAlt || "Image"}
                            width={800}
                            height={600}
                            className="max-w-full h-auto"
                            {...props}
                        />
                    );

                    return hasImageCredit(imageMeta) ? (
                        <span className="relative inline-block max-w-full">
                            {image}
                            <ImageCredit meta={imageMeta} />
                        </span>
                    ) : (
                        image
                    );
                }

                // Fallback for images hosted outside `imageConfig.remotePatterns`.
                // `next/image` throws for those hosts, so a plain <img> is required.
                const image = (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={imageAlt} {...props} />
                );

                return hasImageCredit(imageMeta) ? (
                    <span className="relative inline-block max-w-full">
                        {image}
                        <ImageCredit meta={imageMeta} />
                    </span>
                ) : (
                    image
                );
            }

            if (domNode.name === "dfn" && domNode.attribs) {
                const title = domNode.attribs.title || null;
                return (
                    <DfnWithPopover title={title}>
                        {domToReact(domNode.children as Element[], options)}
                    </DfnWithPopover>
                );
            }
        },
    };

    return parse(html, options);
}
