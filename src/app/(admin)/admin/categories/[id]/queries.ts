export { getAllCategories } from "@/data/categories";

import { asAdmin } from "@/data/authorization";
import { db } from "@/data/db";

export const addCategory = asAdmin((name: string, path: string) =>
    db
        .insertInto("categories")
        .values({
            name,
            path,
            parent_id: 0,
            meta_title: name,
            meta_keyword: name,
            meta_description: name,
            sort_order: 0,
        })
        .execute(),
);
