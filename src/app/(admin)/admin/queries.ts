import { db } from "@/data/db";

export const getArticlesCount = async (): Promise<number> => {
    const result = await db
        .selectFrom("blogs")
        .select((eb) => eb.fn.countAll().as("count"))
        .executeTakeFirst();
    return Number(result?.count ?? 0);
};

export const getPeopleCount = async (): Promise<number> => {
    const result = await db
        .selectFrom("authors")
        .select((eb) => eb.fn.countAll().as("count"))
        .executeTakeFirst();
    return Number(result?.count ?? 0);
};

export const getTotalViewsCount = async (): Promise<number> => {
    const result = await db
        .selectFrom("blogs")
        .select((eb) => eb.fn.sum("total_views").as("total_views"))
        .executeTakeFirst();
    return Number(result?.total_views ?? 0);
};
