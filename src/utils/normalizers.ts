export const normalizeAsOldSlugs = (url: string) => {
    return decodeURIComponent(url);
};

export const denormalizeAsOldSlugs = (url: string) => {
    return encodeURIComponent(url);
};
