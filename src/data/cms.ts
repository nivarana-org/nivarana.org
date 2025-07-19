"use server";
import "server-only";

import knex from "knex";
import { Author, Blog } from "./models";
import Category from "./models/Category";
import Tag from "./models/Tag";
import { fetchWordCloud } from "./word-cloud";

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
            name: "name",
            path: "path",
            email: "email",
        })
        .orderBy("id", "desc");
};

export const getArticlesPaginated = async (
    page = 0,
    per_page = 10,
): Promise<EnhancedArticle[]> => {
    const articles = await Blog.query()
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
            "blogs.type",
        )
        .where("status", "PUBLISHED")
        .withGraphFetched("[authors, categories as category, tags]")
        .orderBy("id", "desc")
        .page(page, per_page);
    return articles.results.map((article) => article.toJSON());
};

export const getArticlesFilteredAndPaginated = async (
    page = 0,
    per_page = 10,
    language = "en",
): Promise<EnhancedArticle[]> => {
    const articles = await Blog.query()
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
            "blogs.type",
        )
        .where("status", "PUBLISHED")
        .where("language", language)
        .withGraphFetched("[authors, categories as category, tags]")
        .orderBy("id", "desc")
        .page(page, per_page);
    return articles.results.map((article) => article.toJSON());
};

export const getArticleFull = async (id: number) => {
    return db<Article>("blogs").select("*").where({ id }).first();
};

export const getArticleFullWithRelations = async (id: number) => {
    const article = await Blog.query()
        .where("id", id)
        .first()
        .withGraphFetched("[authors, categories as category, tags]");
    return article;
};

export const searchArticles = async (query: string) => {
    const articles = await Blog.query()
        .where("status", "PUBLISHED")
        .andWhereRaw(
            "MATCH(page_title, description, meta_description) AGAINST (?)",
            [query],
        )
        .withGraphFetched("[authors, categories as category, tags]");
    return articles;
};

export const getCategoryDetails = async (id: number | string) => {
    return db("categories").select("*").where({ id }).first();
};

export const getAllCategories = async () => {
    return db("categories")
        .select("id", "name")
        .orderBy("id", "asc")
        .where({ parent_id: 0 });
};

export const getAuthorsDetails = async (ids: string[]) => {
    return db("authors").select("*").whereIn("id", ids);
};

export const getAuthor = async (id: number) => {
    const author = await db<Author>("authors")
        .select({
            id: "id",
            name: "name",
            path: "path",
            email: "email",
            description: "description",
            title: "title",
            image: "image",
        })
        .where({ id })
        .first();
    return author;
};

export const getAllAuthors = async () => {
    return db("authors").select("id", "name", "path").orderBy("id", "desc");
};

export const addOrEditPost = async (post: Article) => {
    const timestamp = new Date(Date.now());

    // Start transaction
    return await db.transaction(async (trx) => {
        // Upsert into blogs table
        const { authors, categories, tags, ...rest } = post;

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

        const tagRelations = tags.map((tagId) => ({
            post_id: postId,
            relation_id: tagId,
            relation_type: "tag",
        }));
        await trx("post_relations")
            .where({ post_id: postId, relation_type: "tag" })
            .delete();
        if (tagRelations.length > 0) {
            await trx("post_relations").insert(tagRelations);
        }

        return postId;
    });
};

export const editPostCategory = async (postId: number, categoryId: number) => {
    return await db.transaction(async (trx) => {
        await trx("post_relations")
            .where({ post_id: postId, relation_type: "category" })
            .update("relation_id", categoryId);
        await trx("blogs")
            .where({ id: postId })
            .update("category_name", `${categoryId}`);
    });
};

export const addCategory = async (name: string, path: string) => {
    return await db("categories").insert({
        name,
        path,
        parent_id: 0,
        meta_title: name,
        meta_keyword: name,
        meta_description: name,
        sort_order: 0,
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
        .andWhere("status", "PUBLISHED")
        .first()
        .withGraphFetched("[authors, categories as category, tags]");
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
                $modify: ["onlyPublished"],
                categories: true,
                tags: true,
                authors: true,
            },
        })
        .modifyGraph("articles", (builder) => {
            builder.orderBy("created_at", "desc");
        });
    return author;
};

export const getCategoryByPath = async (path: string) => {
    const category = await Category.query()
        .where("path", path)
        .first()
        .withGraphFetched({
            articles: {
                $modify: ["onlyPublished"],
                categories: true,
                tags: true,
                authors: true,
            },
        })
        .modifyGraph("articles", (builder) => {
            builder.orderBy("created_at", "desc");
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
    return Blog.query()
        .modify("onlyPublished")
        .withGraphFetched("[authors, categories as category, tags]")
        .orderBy("total_views", "desc")
        .limit(5);
};

export const getRandomPosts = async () => {
    return Blog.query()
        .modify("onlyPublished")
        .withGraphFetched("[authors, categories as category, tags]")
        .orderByRaw("RAND()")
        .limit(5);
};

export const incrementBlogViewCount = async (id: number) => {
    const post = await Blog.query().findById(id).increment("total_views", 1);
    return post?.total_views;
};

export const getTotalViewsCount = async () => {
    const views = await Blog.query().sum("total_views");
    return views[0]["sum(`total_views`)"];
};

export const getCategoriesTable = async () => {
    const categories = await Category.query()
        .where({ parent_id: 0 })
        .withGraphFetched("articles");
    return categories;
};

export const getCategoriesForFrontPage = async () => {
    const categories = await Category.query()
        .where({ parent_id: 0 })
        .select("categories.*") // Select all category columns
        .leftJoinRelated("articles") // Join with articles to access their times
        .groupBy("categories.id") // Group by category ID to use MAX aggregate
        .withGraphFetched("articles.[categories as category,authors]");
    categories.forEach((c) => {
        c.articles.reverse();
    });
    categories.sort(
        (a, b) =>
            b.articles[0].published_time() - a.articles[0].published_time(),
    );
    return categories.map((c) => c.toJSON());
};

export const getCategories = async () => {
    const categories = await Category.query()
        .withGraphFetched("children.[children.^]")
        .where("parent_id", 0);
    return JSON.parse(JSON.stringify(categories));
};

export const publishScheduledPostsNeedingPublication = async () => {
    const scheduled = await Blog.query()
        .where("scheduled_time", "<", new Date())
        .andWhere("status", "!=", "PUBLISHED")
        .patch({ status: "PUBLISHED" })
        .returning("id");
    return JSON.parse(JSON.stringify(scheduled));
};

export const getAllArticlesAndTags = async () => {
    const articles = await Blog.query().withGraphFetched("[tags]");
    return articles;
};

export const editPostTags = async (postId, tags) => {
    return await db.transaction(async (trx) => {
        const tagRelations = tags.map((tagId) => ({
            post_id: postId,
            relation_id: tagId,
            relation_type: "tag",
        }));
        await trx("post_relations")
            .where({ post_id: postId, relation_type: "tag" })
            .delete();
        if (tagRelations.length > 0) {
            await trx("post_relations").insert(tagRelations);
        }

        return postId;
    });
};

export const addTag = async (name, path) => {
    return await Tag.query().insert({ name, path });
};

export const getAllTags = async () => {
    const tags = await Tag.query();
    return JSON.parse(JSON.stringify(tags));
};

export const getTagByPath = async (path: string) => {
    const tag = await Tag.query()
        .where("path", path)
        .first()
        .withGraphFetched({
            articles: {
                $modify: ["onlyPublished"],
                categories: true,
                authors: true,
                tags: true,
            },
        })
        .modifyGraph("articles", (builder) => {
            builder.orderBy("created_at", "desc");
        });
    return tag;
};

export const getRedirect = async (path) => {
    const redirects = await db("redirects")
        .select("*")
        .where({ source: path })
        .first();
    return redirects;
};

export const getWordCloud = async () => {
    return fetchWordCloud(db);
};
