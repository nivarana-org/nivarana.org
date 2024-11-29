'use server';
import 'server-only';

import knex from "knex";

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DATABASE,
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
  page_name: string;
  page_title: string;
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
  page_name: string;
  page_title: string;
  category_name: string;
  authors: string;
  upload_image: string;
  created_at: number;
  updated_at: number;
  category: Category;
  authors_data: Author[];
}

export const addNewsLetterSubscriber = async(email: string) => {
  await db<NewsletterSubscriber>('newsletters').insert({user_email: email})
  return "Success"
}

export const getSubscribers = async () => {
  return await db<NewsletterSubscriber>('newsletters').select("user_email", "id").orderBy('id', 'desc')
}

const getTableCount = async (table) => {
  const result = await db(table).count('* as count');
  return result[0].count;
}

export const getSubscribersCount = async () => {
  return getTableCount('newsletters')
}

export const getArticlesCount = async () => {
  return getTableCount('blogs');
}

export const getArticlesOverview = async () => {
  return db<Article>('blogs').select("*")
}

export const getArticleFull = async (id: number) => {
  return db<Article>('blogs').select("*").where({id}).first();
}

export const getCategoryDetails = async (id: number | string) => {
  return db('categories').select('*').where({id}).first();
}

export const getAuthorsDetails = async (ids: string[]) => {
  return db('authors').select('*').whereIn('id', ids);
}

export const getArticleByPath = async (path: string): Promise<EnhancedArticle | undefined> => {
  const post = await db<Article>('blogs').select('*').where({path}).first();
  if (!post) return;
  const category_id = post?.category_name;
  const authors_ids = post?.authors.split(',');
  const categoryRequest = getCategoryDetails(category_id);
  const authorsRequest = getAuthorsDetails(authors_ids);
  const [category, authors] = await Promise.all([categoryRequest, authorsRequest]);
  const enhancedPost: EnhancedArticle = {
    ...post,
    category,
    authors_data: authors
  }
  enhancedPost.upload_image = "https://blogsadmin.nivarana.org/images/" + enhancedPost.upload_image
  return enhancedPost
}