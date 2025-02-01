const API = "https://blogsadmin.nivarana.org/api/";
// const API = "http:localhost:8000/api/"


export const getCategories = async () => {
    const res = await fetch(API + "category");
    const data = await res.json();
    return data.data;
};


export const getImages = async () => {
    const res = await fetch("/admin/api/images");
    const data = await res.json();
    return data.images;
};
