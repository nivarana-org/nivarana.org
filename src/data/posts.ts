import { db } from "./db";

export const getArticlesOverview = () =>
    db.selectFrom("blogs").selectAll().orderBy("id", "desc").execute();
