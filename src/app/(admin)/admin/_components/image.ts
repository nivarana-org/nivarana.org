export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    const result = await fetch("/admin/api/images/upload", {
        body: formData,
        method: "post",
    });
    const data = await result.json();
    return data;
};
