import Link from "next/link";

import { getTagCloud } from "../../queries";

import styles from "./tag-cloud.module.css";

type TagCloudTag = {
    count: number;
    value: string;
    slug: string;
};

type TagCloudRow = {
    tags: TagCloudTag[];
    direction: "normal" | "reverse";
    duration: number;
    delay: number;
};

const ROW_COUNT = 4;
const MIN_DURATION = 35;
const MAX_DURATION = 75;
const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 44;
const MIN_ITEMS_PER_HALF = 16;

function shuffle<T>(items: T[]): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function buildRows(tags: TagCloudTag[]): TagCloudRow[] {
    const shuffled = shuffle(tags);

    return Array.from({ length: ROW_COUNT }, (_, index) => {
        const duration = Math.round(
            MIN_DURATION + Math.random() * (MAX_DURATION - MIN_DURATION),
        );

        return {
            tags: shuffled.filter(
                (_, tagIndex) => tagIndex % ROW_COUNT === index,
            ),
            direction: index % 2 === 0 ? "normal" : "reverse",
            duration,
            // A negative delay starts each row part-way through its loop so
            // rows do not line up with each other.
            delay: -Math.round(Math.random() * duration),
        } satisfies TagCloudRow;
    }).filter((row) => row.tags.length > 0);
}

export default async function TagCloud() {
    const tags = await getTagCloud();

    if (tags.length === 0) {
        return null;
    }

    const rows = buildRows(tags);
    const counts = rows.flatMap((row) => row.tags.map((tag) => tag.count));
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);

    const sizeFor = (count: number) => {
        if (maxCount === minCount) {
            return (MIN_FONT_SIZE + MAX_FONT_SIZE) / 2;
        }
        const ratio = (count - minCount) / (maxCount - minCount);
        return Math.round(
            MIN_FONT_SIZE + ratio * (MAX_FONT_SIZE - MIN_FONT_SIZE),
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <nav
                aria-label="Tags"
                className={`${styles.cloud} flex flex-col gap-1`}
            >
                {rows.map((row, rowIndex) => {
                    // Repeat short rows so the marquee always covers the
                    // viewport, then render the sequence twice for a seamless
                    // -50% loop.
                    const repeats = Math.max(
                        1,
                        Math.ceil(MIN_ITEMS_PER_HALF / row.tags.length),
                    );
                    const items = Array.from(
                        { length: repeats },
                        () => row.tags,
                    ).flat();

                    return (
                        <div key={rowIndex} className={styles.viewport}>
                            <div
                                className={styles.track}
                                style={{
                                    animationDuration: `${row.duration}s`,
                                    animationDirection: row.direction,
                                    animationDelay: `${row.delay}s`,
                                }}
                            >
                                <TagList items={items} sizeFor={sizeFor} />
                                <TagList
                                    items={items}
                                    sizeFor={sizeFor}
                                    duplicate
                                />
                            </div>
                        </div>
                    );
                })}
            </nav>
        </div>
    );
}

type TagListProps = {
    items: TagCloudTag[];
    sizeFor: (count: number) => number;
    duplicate?: boolean;
};

function TagList({ items, sizeFor, duplicate = false }: TagListProps) {
    return (
        <div
            className={
                duplicate ? `${styles.half} ${styles.duplicate}` : styles.half
            }
            aria-hidden={duplicate || undefined}
        >
            {items.map((tag, index) => (
                <Link
                    key={`${tag.slug}-${index}`}
                    href={`/tag/${tag.slug}`}
                    className="mr-6 shrink-0 whitespace-nowrap text-nivarana-blue transition-colors duration-200 hover:text-nivarana-green"
                    style={{ fontSize: `${sizeFor(tag.count)}px` }}
                    tabIndex={duplicate ? -1 : undefined}
                >
                    {tag.value}
                </Link>
            ))}
        </div>
    );
}
