export { getAllCategories } from "@/data/categories";

import { asAdmin } from "@/data/authorization";
import { db } from "@/data/db";

export const addCategory = asAdmin((name: string, slug: string) =>
    db
        .insertInto("categories")
        .values({
            name,
            slug,
            parent_id: 0,
            intro: name,
            sort_order: 0,
        })
        .execute(),
);
