import { asAdmin } from "./authorization";
import { db } from "./db";

export const addTag = asAdmin((name: string, path: string) =>
    db.insertInto("tags").values({ name, path }),
);
