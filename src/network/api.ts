export const getImages = async () => {
    const res = await fetch("/admin/api/images");
    const data = await res.json();
    return data.images;
};
