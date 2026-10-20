"use server";
import "server-only";

import { Author, Blog } from "./models";
import Category from "./models/Category";

export interface Article {
    id: number;
    path: string;
    total_views: number;
    page_title: string;
    description: string;
    category_name: string;
    authors: number[];
    tags: number[];
    upload_image: string;
    created_at: number;
    updated_at: number;
    meta_title: string;
    meta_keyword: string;
    meta_description: string;
}

export interface AuthorOld {
    id: number;
    name: string;
    email: string;
    path: string;
    description: string;
    title: string;
    image: string;
}
export interface EnhancedArticle extends Article {
    id: number;
    path: string;
    total_views: number;
    page_title: string;
    category_name: string;
    authors: number[];
    upload_image: string;
    created_at: number;
    updated_at: number;
    category: Category;
    authors: AuthorOld[];
}

export const getAuthorByPath = async (path: string) => {
    const author = await Author.query()
        .where("path", path)
        .first()
        .withGraphFetched({
            articles: {
                $modify: ["onlyPublished", "orderByCreatedDesc"],
                categories: true,
                tags: true,
                authors: true,
            },
        });
    return author;
};

export const getCategoryByPath = async (path: string) => {
    const category = await Category.query()
        .where("path", path)
        .first()
        .withGraphFetched({
            articles: {
                $modify: ["onlyPublished", "orderByCreatedDesc"],
                categories: true,
                tags: true,
                authors: true,
            },
        });
    return category;
};

export const getPopularPosts = async () => {
    return Blog.query()
        .modify("onlyPublished")
        .withGraphFetched("[authors, categories as category, tags]")
        .orderBy("total_views", "desc")
        .limit(5);
};

export const incrementBlogViewCount = async (id: number) => {
    const post = await Blog.query().findById(id).increment("total_views", 1);
    return post?.total_views;
};

export const publishScheduledPostsNeedingPublication = async () => {
    const scheduled = await Blog.query()
        .where("scheduled_time", "<", new Date())
        .andWhere("status", "!=", "PUBLISHED")
        .patch({ status: "PUBLISHED" })
        .returning("id");
    return JSON.parse(JSON.stringify(scheduled));
};
