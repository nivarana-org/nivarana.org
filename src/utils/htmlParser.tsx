import parse, {
    attributesToProps,
    domToReact,
    Element,
} from "html-react-parser";
import Image from "next/image";
import { type ReactNode } from "react";
import { imageConfig } from "@/config/images";
import { DfnWithPopover } from "@/components/shared/DfnWithPopover";
import { getImageURLFromFileName } from "./paths";

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

const RELATIVE_PREFIX = "../../images/";

function parseUrl(url: string): string {
    if (url.startsWith(RELATIVE_PREFIX)) {
        return getImageURLFromFileName(url.slice(RELATIVE_PREFIX.length));
    }
    return url;
}

export function parseHtml(html: string): ReactNode {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {
        replace(domNode: Element) {
            if (domNode.name === "img" && domNode.attribs) {
                const { src, alt, ...rest } = domNode.attribs;

                if (!src) {
                    return;
                }

                const parsedUrl = parseUrl(src);

                if (isImageUrlAllowed(parsedUrl)) {
                    const props = attributesToProps(rest);
                    return (
                        <Image
                            src={parsedUrl}
                            alt={alt || "Image"}
                            width={800}
                            height={600}
                            className="max-w-full h-auto"
                            {...props}
                        />
                    );
                }

                return (
                    <img
                        src={src}
                        alt={alt || ""}
                        {...attributesToProps(rest)}
                    />
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
