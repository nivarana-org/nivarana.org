import Link from "next/link";
import { Button } from "@mui/material";

/**
 * Navigation between the chapters of a paged story. The chapter is addressed
 * as `?chapter=N`, and `?chapter=all` shows the whole story on one page.
 */
export default function ChapterNav({
    chapter,
    total,
}: {
    chapter: number;
    total: number;
}) {
    const isFirst = chapter === 0;
    const isLast = chapter + 1 === total;

    return (
        <div className="max-w-2xl mx-auto text-4xl text-black mt-8 p-2 flex justify-between">
            {isFirst ? (
                <Link href={{ query: { chapter: "all" } }}>
                    <Button>View in Single Page</Button>
                </Link>
            ) : (
                <Link href={{ query: { chapter: `${chapter - 1}` } }}>
                    <Button>Previous</Button>
                </Link>
            )}

            {!isLast ? (
                <Link href={{ query: { chapter: `${chapter + 1}` } }}>
                    <Button>Next</Button>
                </Link>
            ) : (
                <Link href={{ query: { chapter: "0" } }}>
                    <Button>Restart</Button>
                </Link>
            )}
        </div>
    );
}
