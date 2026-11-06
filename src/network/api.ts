import type {
    MediaAuthorOption,
    MediaDuplicateGroup,
    MediaItem,
    MediaMetadataInput,
    MediaType,
} from "@/types/media";

type MediaResponse = {
    status: boolean;
    media: MediaItem[];
};

type AuthorsResponse = {
    status: boolean;
    authors: MediaAuthorOption[];
};

type UploadResponse = {
    status: boolean;
    media: MediaItem;
    filename: string;
    link: string;
};

const parseError = async (response: Response) => {
    const data = await response.json().catch(() => null);
    return (
        data?.message || data?.error || `Request failed (${response.status})`
    );
};

export const getMedia = async (type?: MediaType): Promise<MediaItem[]> => {
    const params = new URLSearchParams();
    if (type) {
        params.set("type", type);
    }
    const query = params.toString();
    const response = await fetch(`/admin/api/media${query ? `?${query}` : ""}`);
    if (!response.ok) {
        throw new Error(await parseError(response));
    }
    const data: MediaResponse = await response.json();
    return data.media;
};

export const getDuplicateMedia = async (): Promise<MediaDuplicateGroup[]> => {
    const response = await fetch("/admin/api/media/duplicates");
    if (!response.ok) {
        throw new Error(await parseError(response));
    }
    const data: { status: boolean; groups: MediaDuplicateGroup[] } =
        await response.json();
    return data.groups;
};

export const getAuthors = async (): Promise<MediaAuthorOption[]> => {
    const response = await fetch("/admin/api/authors");
    if (!response.ok) {
        throw new Error(await parseError(response));
    }
    const data: AuthorsResponse = await response.json();
    return data.authors;
};

export const uploadMedia = async (
    file: Blob,
    filename?: string,
): Promise<UploadResponse> => {
    const formData = new FormData();
    const name =
        filename || (file instanceof File ? file.name : "upload") || "upload";
    formData.append("file", file, name);

    const response = await fetch("/admin/api/media/upload", {
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        throw new Error(await parseError(response));
    }
    return response.json();
};

export const updateMedia = async (
    id: number,
    metadata: MediaMetadataInput,
): Promise<MediaItem> => {
    const response = await fetch(`/admin/api/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
    });
    if (!response.ok) {
        throw new Error(await parseError(response));
    }
    const data: { status: boolean; media: MediaItem } = await response.json();
    return data.media;
};

export const deleteMedia = async (id: number): Promise<void> => {
    const response = await fetch(`/admin/api/media/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error(await parseError(response));
    }
};
