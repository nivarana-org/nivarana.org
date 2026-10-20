import { db } from "@/data/db";

export const addTag = (name: string, path: string) =>
    db.insertInto("tags").values({ name, path }).execute();
