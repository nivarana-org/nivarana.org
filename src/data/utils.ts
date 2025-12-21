import { group, mapValues } from "radash";
type Serializable = string | number;

export const groupOrderAndSelect = <
    T extends Record<K, Serializable>,
    K extends keyof T,
>(
    rows: T[],
    groupByKey: K,
    orderByKey: K,
    selectKey: K,
) => {
    const grouped = group(rows, (row) => row[groupByKey] as string);
    const ordered = mapValues(grouped, (value) =>
        value
            ?.sort((a, b) => Number(a[orderByKey]) - Number(b[orderByKey]))
            .map((i) => i[selectKey]),
    );
    return ordered;
};
