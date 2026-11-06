const emptyFileName = (filename?: string | null) => {
    if (filename === null) return true;
    if (filename === undefined) return true;
    if (filename === "") return true;
    return false;
};
export const getImageURLFromFileName = (filename?: string | null) => {
    if (emptyFileName(filename)) {
        return "https://picsum.photos/200/300?grayscale";
    }
    const definedPrefix = process.env.NEXT_PUBLIC_IMAGE_PREFIX;
    if (definedPrefix) {
        return `${definedPrefix}${filename}`;
    }
    return `https://nivarana.org/images/${filename}`;
};

/**
 * The relative form used in article bodies. Article pages live two levels
 * below the site root, so this resolves to `/images/<filename>`.
 */
export const RELATIVE_IMAGE_PREFIX = "../../images/";

export const getRelativeImageURLFromFileName = (filename: string): string =>
    `${RELATIVE_IMAGE_PREFIX}${filename}`;

type CategoryRef = {
    name?: string;
    slug: string;
};

type GetURLData = {
    slug: string;
    category?: CategoryRef | CategoryRef[];
    categories?: CategoryRef[];
    /**
     * The chapter to deep link to. Only meaningful for paged stories, whose
     * chapters are addressed as `?chapter=N`.
     */
    chapter?: number | string | null;
};

const firstCategory = (data: GetURLData): CategoryRef | undefined => {
    if (Array.isArray(data.category)) {
        return data.category[0];
    }
    if (data.category) {
        return data.category;
    }
    return data.categories?.[0];
};

export const getArticlePublicURL = (data: GetURLData) => {
    return `https://nivarana.org${getArticleSlug(data)}`;
};

export const getArticleSlug = (data: GetURLData) => {
    const category = firstCategory(data);
    const slug = `/${category?.slug ?? ""}/${data.slug}`;
    if (
        data.chapter === undefined ||
        data.chapter === null ||
        data.chapter === ""
    ) {
        return slug;
    }
    return `${slug}?chapter=${data.chapter}`;
};

export const getReturnURL = (base: string, returnURL: string | undefined) => {
    let url = base;
    if (returnURL) {
        url += "?return=" + encodeURIComponent(returnURL);
    }
    return url;
};
