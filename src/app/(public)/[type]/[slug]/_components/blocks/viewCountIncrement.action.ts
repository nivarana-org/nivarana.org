"use server";

import { incrementBlogViewCount } from "@/data/posts";

export const increment = async (id: number) => {
    return await incrementBlogViewCount(id);
};
