import { db } from "@/data/db";

export const publishScheduledPostsNeedingPublication = async () => {
    const result = await db
        .updateTable("blogs")
        .set({ status: "PUBLISHED" })
        .where("scheduled_time", "<", new Date())
        .where("status", "!=", "PUBLISHED")
        .executeTakeFirst();
    return Number(result?.numUpdatedOrDeletedRows ?? 0);
};
