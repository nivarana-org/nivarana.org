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

const addNewsLetterSubscriber = async(email: string) => {
  await db<NewsletterSubscriber>('newsletters').insert({user_email: email})
  return "Success"
}

export const addNewsLetterSubscriberAction = async (prevState: {message: string}, formData: FormData) => {
  const email = formData.get('email') || "";
  try {
    await addNewsLetterSubscriber(email);
    return {message: "Added successfully"};
  }
  catch (e) {
    if (e.code = "ER_DUP_ENTRY") return {error: "Email already subscribed"};
    return {error: "Couldn't add the email"};
  }
}

export const getSubscribers = async () => {
  return await db<NewsletterSubscriber>('newsletters').select("user_email", "id").orderBy('id', 'desc')
}