import { db } from "./db";

export const getAllTags = () =>
    db.selectFrom("tags").selectAll().orderBy("id", "asc").execute();
