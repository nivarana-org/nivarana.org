"use server";
import "server-only";

import knex from "knex";
import { Author, Blog } from "./models";
import Category from "./models/Category";

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
    authors: number[];
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
    authors_data: AuthorOld[];
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

export const getAuthorsOverview = async () => {
    return db<Author>("authors")
        .select({
            id: "id",
            name: "author_name",
            path: "path",
            email: "author_email",
        })
        .orderBy("id", "desc");
};

export const getArticlesPaginated = async (
    page = 0,
    per_page = 10,
): Promise<EnhancedArticle[]> => {
    const blogsQuery = db("blogs")
        .select(
            "blogs.id",
            "blogs.page_title",
            "blogs.path",
            "blogs.description",
            "blogs.upload_image",
            "blogs.meta_title",
            "blogs.meta_description",
            "blogs.created_at",
            "blogs.updated_at",
            db.raw(
                `(
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', a.id, 
                            'name', a.author_name, 
                            'path', a.path
                        )
                    )
                    FROM authors a
                    JOIN post_relations pr ON a.id = pr.relation_id
                    WHERE pr.post_id = blogs.id AND pr.relation_type = 'author'
                ) as authors_data`,
            ),
            db.raw(
                `(
            SELECT JSON_OBJECT('id', c.id, 'name', c.name, 'path', c.path)
            FROM categories c
            WHERE c.id = blogs.category_name
          ) as category`,
            ),
        )
        .orderBy("id", "desc")
        .limit(per_page)
        .offset(page * per_page);
    const blogs = (await blogsQuery).map(
        ({ authors_data, category, ...rest }) => ({
            authors_data: JSON.parse(authors_data),
            category: JSON.parse(category),
            ...rest,
        }),
    );
    return blogs;
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

export const getAuthor = async (id: number) => {
    const author = await db<Author>("authors")
        .select({
            id: "id",
            name: "author_name",
            path: "path",
            email: "author_email",
            description: "description",
            title: "first_peragraph",
            image: "upload_image",
        })
        .where({ id })
        .first();
    return author;
};

export const getAllAuthors = async () => {
    return db("authors")
        .select("id", "author_name", "path")
        .orderBy("id", "desc");
};

export const addOrEditPost = async (post: Article) => {
    const timestamp = new Date(Date.now());

    // Start transaction
    return await db.transaction(async (trx) => {
        // Upsert into blogs table
        const { authors, categories, ...rest } = post;

        const [postId] = await trx("blogs")
            .insert({
                authors: authors.join(","),
                category_name: categories[0],
                ...rest,
                created_at: timestamp,
                updated_at: timestamp,
            })
            .onConflict("id")
            .merge({ ...rest, updated_at: timestamp })
            .returning("id");

        // Prepare the authors data for `post_relations`
        const authorRelations = authors.map((authorId) => ({
            post_id: postId,
            relation_id: authorId,
            relation_type: "author",
        }));

        // Update post_relations
        await trx("post_relations")
            .where({ post_id: postId, relation_type: "author" })
            .delete();
        if (authorRelations.length > 0) {
            await trx("post_relations").insert(authorRelations);
        }

        const categoryRelations = categories.map((categoryId) => ({
            post_id: postId,
            relation_id: categoryId,
            relation_type: "category",
        }));

        await trx("post_relations")
            .where({ post_id: postId, relation_type: "category" })
            .delete();
        if (categoryRelations.length > 0) {
            await trx("post_relations").insert(categoryRelations);
        }

        return postId;
    });
};
export const addOrEditAuthor = async (author: Author) => {
    const timestamp = new Date(Date.now());
    const query = db("authors")
        .insert({ ...author, created_at: timestamp, updated_at: timestamp })
        .onConflict("id")
        .merge({ ...author, updated_at: timestamp });
    return await query;
};

export const getArticleByPath = async (path: string) => {
    const article = await Blog.query()
        .where("path", path)
        .first()
        .withGraphFetched("[authors as authors_data, categories as category]");
    return article;
};

export const getPageByPath = async (path: string) => {
    const page = await db("static_pages")
        .select("*")
        .where({ page_name: path })
        .first();
    return page;
};

export const getAuthorByPath = async (path: string) => {
    const author = await Author.query()
        .where("path", path)
        .first()
        .withGraphFetched({
            articles: {
                categories: true,
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
                categories: true,
                authors: true,
            },
        });
    return category;
};

export const getWebPushSubscriberCount = async () => {
    return getTableCount("push_subscriptions");
};

export const getPeopleCount = async () => {
    return getTableCount("authors");
};

export const getPopularPosts = async () => {
    return Blog.query().orderBy("total_views", "desc").limit(5);
};

export const getRandomPosts = async () => {
    return Blog.query().orderByRaw("RAND()").limit(5);
};

export const incrementBlogViewCount = async (id: number) => {
    const post = await Blog.query().findById(id).increment("total_views", 1);
    return post?.total_views;
};

export const getCategories = async () => {
    const categories = await Category.query()
        .withGraphFetched("children.[children.^]")
        .where("parent_id", 0);
    return JSON.parse(JSON.stringify(categories));
};
