export const getImageURLFromFileName = (filename: string) => {
    const definedPrefix = process.env.NEXT_PUBLIC_IMAGE_PREFIX;
    if (definedPrefix) {
        return `${definedPrefix}${filename}`;
    }
    return `https://nivarana.org/images/${filename}`;
};

type GetURLData = {
    type: string;
    path: string;
    category: {
        name: string;
        path: string;
    };
};

export const getArticlePublicURL = (data: GetURLData) => {
    return `https://nivarana.org${getArticleSlug(data)}`;
};

export const getArticleSlug = (data: GetURLData) => {
    return `/${data.category.path}/${data.path}`;
};
