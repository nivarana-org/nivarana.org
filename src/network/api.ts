const API = "https://blogsadmin.nivarana.org/api/";
// const API = "http:localhost:8000/api/"


export const incrementBlogViewCount = (id: string) => {
    return fetch(API + "update_blog_view", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            blog_id: id,
        }),
        cache: "no-store",
    })
        .then((response) => response.json())
        .then((json) => {
            return json["count"];
        });
};



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
