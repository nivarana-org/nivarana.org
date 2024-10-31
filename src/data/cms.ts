'use server';
import 'server-only';

import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  password: process.env.DB_PASS,
  connectionLimit: 5
});

console.log("connecting mariadb");

const execute = async (cb) => {
  let conn;
  try {
    conn = await pool.getConnection();
    return await cb(conn)
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

const addNewsLetterSubscriber = async(email: string) => {
  return await execute(async (conn) => {
    await conn.query("INSERT INTO newsletters (user_email) value (?)", [email]);
    return "Success!";
  })
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