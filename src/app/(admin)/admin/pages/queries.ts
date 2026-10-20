import { db } from "@/data/db";

export const getPagesOverview = () =>
    db.selectFrom("static_pages").selectAll().orderBy("id", "asc").execute();
