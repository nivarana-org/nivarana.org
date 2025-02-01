export const getImageURLFromFileName = (filename: string) => {
    const definedPrefix = process.env.NEXT_PUBLIC_IMAGE_PREFIX;
    if (definedPrefix) {
        return `${definedPrefix}${filename}`;
    }
    return `https://nivarana.org/images/${filename}`;
};
