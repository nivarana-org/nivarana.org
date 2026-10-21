/**
 * The unified content model.
 *
 * Every post on Nivarana — a plain article or a photo essay — stores its body
 * in `blogs.contents` as a single JSON document:
 *
 *     { "chapters": [ { "title": "...", "body": "<p>…</p>", "image": "x.png" } ] }
 *
 * An article is simply a story with exactly one chapter. The reader decides
 * how to arrange the chapters based on the post's layout, so there is only ever
 * one parser, one serialiser and one body renderer.
 */

export type Chapter = {
    title: string;
    body: string;
    image?: string | null;
};

export type Story = {
    chapters: Chapter[];
};

/** How the chapters of a story are arranged on the page. */
export type PostLayout = "continuous" | "paged";

export const CONTINUOUS_LAYOUT: PostLayout = "continuous";
export const PAGED_LAYOUT: PostLayout = "paged";

export const POST_LAYOUTS: PostLayout[] = [CONTINUOUS_LAYOUT, PAGED_LAYOUT];

export const isPostLayout = (value: unknown): value is PostLayout =>
    value === CONTINUOUS_LAYOUT || value === PAGED_LAYOUT;

const normalizeChapter = (raw: unknown): Chapter => {
    if (typeof raw !== "object" || raw === null) {
        return { title: "", body: "", image: null };
    }
    const chapter = raw as Record<string, unknown>;
    return {
        title: typeof chapter.title === "string" ? chapter.title : "",
        body: typeof chapter.body === "string" ? chapter.body : "",
        image:
            typeof chapter.image === "string" && chapter.image.length > 0
                ? chapter.image
                : null,
    };
};

const parseJson = (value: string): unknown => {
    try {
        return JSON.parse(value);
    } catch {
        return undefined;
    }
};

/**
 * Reads a story out of whatever shape `blogs.contents` happens to arrive in.
 *
 * Kysely's `ParseJSONResultsPlugin` auto-parses any string that looks like a
 * JSON document, so `contents` reaches us as an object on some paths and as a
 * string on others. A post whose body has not been migrated yet arrives as a
 * bare HTML string, which we treat as a single untitled chapter.
 */
export const parseStory = (contents: unknown): Story => {
    if (contents === null || contents === undefined) {
        return { chapters: [] };
    }

    if (typeof contents === "object") {
        const document = contents as Record<string, unknown>;
        if (!Array.isArray(document.chapters)) {
            return { chapters: [] };
        }
        return { chapters: document.chapters.map(normalizeChapter) };
    }

    if (typeof contents === "string") {
        const trimmed = contents.trim();
        if (trimmed.length === 0) {
            return { chapters: [] };
        }
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
            const parsed = parseJson(trimmed);
            if (parsed !== undefined) {
                return parseStory(parsed);
            }
        }
        // Legacy body: a plain HTML article that has not been migrated yet.
        return { chapters: [normalizeChapter({ body: contents })] };
    }

    return { chapters: [] };
};

/** The canonical on-disk representation of a story. */
export const serializeStory = (chapters: Chapter[]): string =>
    JSON.stringify({ chapters: chapters.map(normalizeChapter) });

/**
 * The plain-text body of a story, used to populate the denormalised
 * `blogs.body_text` column that the fulltext index searches.
 */
export const storyBodyText = (chapters: Chapter[]): string =>
    chapters
        .map((chapter) => stripHtml(chapter.body))
        .filter((text) => text.length > 0)
        .join(" ");

export const stripHtml = (html: string): string =>
    html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/\s+/g, " ")
        .trim();

/**
 * The layout a story gets when its author has not chosen one: a single
 * chapter reads as a continuous article, several chapters read as a paged
 * photo essay.
 */
export const deriveLayout = (chapterCount: number): PostLayout =>
    chapterCount > 1 ? PAGED_LAYOUT : CONTINUOUS_LAYOUT;

/**
 * The layout a story is actually rendered with. A story that has no stored
 * layout yet falls back to the derived one.
 */
export const resolveLayout = (
    chapterCount: number,
    layout?: PostLayout | null,
): PostLayout => (isPostLayout(layout) ? layout : deriveLayout(chapterCount));

/** A story with no chapters is still an article waiting to be written. */
export const ensureChapter = (chapters: Chapter[]): Chapter[] =>
    chapters.length > 0 ? chapters : [normalizeChapter({})];
