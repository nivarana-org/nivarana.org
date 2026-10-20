"use server";
import "server-only";

import { Author } from "./models";
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
