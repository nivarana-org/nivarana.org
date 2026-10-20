import { asAdmin } from "@/data/authorization";
import { db } from "@/data/db";

export const addTag = asAdmin((name: string, path: string) =>
    db.insertInto("tags").values({ name, path }).execute(),
);
