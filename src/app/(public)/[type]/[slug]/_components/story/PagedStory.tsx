import type { Chapter } from "@/data/story";
import Link from "next/link";
import { Button } from "@mui/material";

import ChapterNav from "./ChapterNav";
import ClearChapter from "./ClearChapter";
import ScrollToTop from "./ScrollToTop";
import StoryChapter from "./StoryChapter";
import StoryFooter from "./StoryFooter";
import StoryHero from "./StoryHero";
import type { StoryPost } from "./types";

/**
 * The paged layout: a story is read one chapter at a time, behind a full
 * bleed banner. `?chapter=N` shows a single chapter and `?chapter=all` shows
 * the whole story on one page.
 *
 * The author bios and the comments only appear after the last chapter, so a
 * reader reaches the discussion once they have finished the story.
 *
 * A paged story keeps to the width of the screen, the way a photo essay
 * always has: the photographs stay a comfortable size on a wide monitor
 * instead of stretching from edge to edge.
 */
export default function PagedStory({
    data,
    chapters,
    chapter,
}: {
    data: StoryPost;
    chapters: Chapter[];
    chapter: string;
}) {
    const singlePage = chapter === "all";
    const total = chapters.length;

    if (total === 0) {
        return (
            <div className="max-w-(--breakpoint-xl) mx-auto">
                <StoryFooter data={data} />
            </div>
        );
    }

    // A chapter that is not there falls back to the one that is: the last
    // chapter of the story.
    const requested = Number(chapter);
    const page = Number.isInteger(requested)
        ? Math.min(Math.max(requested, 0), total - 1)
        : 0;

    if (singlePage) {
        return (
            <div className="max-w-(--breakpoint-xl) mx-auto">
                <ClearChapter />
                <div className="post post-single">
                    <StoryHero data={data} />
                    <div className="mt-6"></div>
                    {chapters.map((c, index) => (
                        <StoryChapter
                            key={index}
                            chapter={c}
                            bodyClassName="max-w-4xl mx-auto"
                        />
                    ))}
                </div>
                <StoryFooter data={data} />
            </div>
        );
    }

    if (page === 0) {
        return (
            <div className="max-w-(--breakpoint-xl) mx-auto">
                <ClearChapter />
                <div className="post post-single">
                    <StoryHero data={data} />
                    <div className="mt-6"></div>
                    <StoryChapter
                        chapter={chapters[0]}
                        bodyClassName="max-w-4xl mx-auto"
                    />

                    <div className="max-w-2xl mx-auto text-4xl text-black mt-8 p-2 flex justify-between">
                        <Link href={{ query: { chapter: "all" } }}>
                            <Button>View in Single Page</Button>
                        </Link>
                        {total > 1 ? (
                            <Link href={{ query: { chapter: "1" } }}>
                                <Button>Start</Button>
                            </Link>
                        ) : null}
                    </div>
                </div>
                <StoryFooter
                    data={data}
                    showBios={false}
                    showComments={false}
                />
            </div>
        );
    }

    const isLast = page + 1 === total;
    return (
        <div className="max-w-(--breakpoint-xl) mx-auto">
            <ClearChapter />
            <div className="post post-single">
                <div className="mt-6"></div>
                <ScrollToTop />
                <StoryChapter
                    key={page}
                    chapter={chapters[page]}
                    bodyClassName="max-w-4xl mx-auto"
                />
                <ChapterNav chapter={page} total={total} />
            </div>
            <StoryFooter data={data} showBios={isLast} showComments={isLast} />
        </div>
    );
}
