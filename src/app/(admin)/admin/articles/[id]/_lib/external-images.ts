import type { Chapter } from "@/data/story";

const HTTP_URL = /^https?:\/\//i;

export const isExternalImageSource = (source: string): boolean =>
    HTTP_URL.test(source.trim());

/**
 * Finds each unique image in the story whose `src` still points at another
 * site. A relative link (including one this feature wrote earlier) is left
 * alone.
 */
export const collectExternalImageSources = (chapters: Chapter[]): string[] => {
    const parser = new DOMParser();
    const sources = new Set<string>();

    for (const chapter of chapters) {
        if (!chapter.body) {
            continue;
        }
        const document = parser.parseFromString(chapter.body, "text/html");
        for (const image of document.querySelectorAll("img[src]")) {
            const source = image.getAttribute("src")?.trim();
            if (source && isExternalImageSource(source)) {
                sources.add(source);
            }
        }
    }

    return [...sources];
};

/**
 * Rewrites the `src` of every image that has a replacement, preserving the
 * rest of the body as the editor produced it.
 */
export const replaceExternalImageSources = (
    html: string,
    replacements: ReadonlyMap<string, string>,
): string => {
    if (!html || replacements.size === 0) {
        return html;
    }

    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");
    let changed = false;

    for (const image of document.querySelectorAll("img[src]")) {
        const source = image.getAttribute("src")?.trim();
        if (!source) {
            continue;
        }
        const replacement = replacements.get(source);
        if (replacement) {
            image.setAttribute("src", replacement);
            changed = true;
        }
    }

    return changed ? document.body.innerHTML : html;
};
