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

export const addNewsLetterSubscriber = async(email: string) => {
  await db<NewsletterSubscriber>('newsletters').insert({user_email: email})
  return "Success"
}

export const getSubscribers = async () => {
  return await db<NewsletterSubscriber>('newsletters').select("user_email", "id").orderBy('id', 'desc')
}