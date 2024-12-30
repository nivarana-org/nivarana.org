"use server";
import "server-only";

import knex from "knex";

export const db = knex({
    client: "mysql",
    connection: {
        host: process.env.DB_HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DATABASE,
        charset: "utf8mb4",
    },
    pool: { min: 0, max: 7 },
});

interface NewsletterSubscriber {
    id: number;
    user_email: string;
    created_at: number;
    updated_at: number;
}

export interface Article {
    id: number;
    path: string;
    total_views: number;
    page_title: string;
    description: string;
    category_name: string;
    authors: string;
    upload_image: string;
    created_at: number;
    updated_at: number;
    meta_title: string;
    meta_keyword: string;
    meta_description: string;
}

interface Category {
    id: number;
    name: string;
    path: string;
}

interface Author {
    id: number;
    name: string;
    path: string;
    description: string;
}
interface EnhancedArticle extends Article {
    id: number;
    path: string;
    total_views: number;
    page_title: string;
    category_name: string;
    authors: string;
    upload_image: string;
    created_at: number;
    updated_at: number;
    category: Category;
    authors_data: Author[];
}

export const addNewsLetterSubscriber = async (email: string) => {
    await db<NewsletterSubscriber>("newsletters").insert({ user_email: email });
    return "Success";
};

export const getSubscribers = async () => {
    return await db<NewsletterSubscriber>("newsletters")
        .select("user_email", "id")
        .orderBy("id", "desc");
};

const getTableCount = async (table) => {
    const result = await db(table).count("* as count");
    return result[0].count;
};

export const getSubscribersCount = async () => {
    return getTableCount("newsletters");
};

export const getArticlesCount = async () => {
    return getTableCount("blogs");
};

export const getArticlesOverview = async () => {
    return db<Article>("blogs").select("*").orderBy("id", "desc");
};

export const getArticleFull = async (id: number) => {
    return db<Article>("blogs").select("*").where({ id }).first();
};

export const searchArticles = async (query: string) => {
    return db<Article>("blogs")
        .select("*")
        .whereRaw(
            "MATCH(page_title, description, meta_description) AGAINST (?)",
            [query],
        );
};

export const getCategoryDetails = async (id: number | string) => {
    return db("categories").select("*").where({ id }).first();
};

export const getAllCategories = async () => {
    return db("categories").select("id", "name").orderBy("id", "asc");
};

export const getAuthorsDetails = async (ids: string[]) => {
    return db("authors").select("*").whereIn("id", ids);
};

export const getAllAuthors = async () => {
    return db("authors")
        .select("id", "author_name", "path")
        .orderBy("id", "desc");
};

export const addOrEditPost = async (post: Article) => {
    const timestamp = new Date(Date.now());
    const query = db("blogs")
        .insert({ ...post, created_at: timestamp, updated_at: timestamp })
        .onConflict("id")
        .merge({ ...post, updated_at: timestamp });
    return await query;
};

export const getArticleByPath = async (
    path: string,
): Promise<EnhancedArticle | undefined> => {
    const post = await db<Article>("blogs").select("*").where({ path }).first();
    if (!post) return;
    const category_id = post?.category_name;
    const authors_ids = post?.authors.split(",");
    const categoryRequest = getCategoryDetails(category_id);
    const authorsRequest = getAuthorsDetails(authors_ids);
    const [category, authors] = await Promise.all([
        categoryRequest,
        authorsRequest,
    ]);
    const enhancedPost: EnhancedArticle = {
        ...post,
        category,
        authors_data: authors,
    };
    enhancedPost.upload_image =
        "https://blogsadmin.nivarana.org/images/" + enhancedPost.upload_image;
    return enhancedPost;
};

export const getWebPushSubscriberCount = async () => {
    return getTableCount("push_subscriptions");
};
