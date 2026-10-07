import { db } from "./db";

export const getSettings = async (keys: string | string[]) => {
    const keyList = Array.isArray(keys) ? keys : [keys];
    const rows = await db
        .selectFrom("settings")
        .where("key", "in", keyList)
        .select(["key", "value"])
        .execute();
    const result: Record<string, string | null> = {};
    for (const key of keyList) {
        result[key] = rows.find((row) => row.key === key)?.value ?? null;
    }
    return result;
};
