import path from "path";

export const getImageUploadDirectory = () => {
    const defaultUploadsDirectory = path.join(
        process.cwd(),
        "public",
        "uploads",
    );
    const uploadsDirectory =
        process.env.IMAGE_UPLOAD_DIRECTORY || defaultUploadsDirectory;

    return uploadsDirectory;
};
