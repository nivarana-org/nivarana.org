export const getImageURLFromFileName = (filename: string) => {
    const definedPrefix = process.env.NEXT_PUBLIC_IMAGE_PREFIX;
    if (definedPrefix) {
        return `${definedPrefix}${filename}`;
    }
    return `https://nivarana.org/images/${filename}`;
};

type GetURLData = {
    type: string;
    slug: string;
    category: {
        name: string;
        slug: string;
    };
};

export const getArticlePublicURL = (data: GetURLData) => {
    if (Array.isArray(data.category)) {
        data.category = data.category[0];
    }
    if (Array.isArray(data.categories)) {
        data.category = data.categories[0];
    }
    return `https://nivarana.org${getArticleSlug(data)}`;
};

export const getArticleSlug = (data: GetURLData) => {
    return `/${data.category.slug}/${data.slug}`;
};

export const getReturnURL = (base: string, returnURL: string | undefined) => {
    let url = base;
    if (returnURL) {
        url += "?return=" + encodeURIComponent(returnURL);
    }
    return url;
};
