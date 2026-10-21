import { PAGED_LAYOUT, parseStory, resolveLayout } from "@/data/story";

import ContinuousStory from "./ContinuousStory";
import PagedStory from "./PagedStory";
import type { StoryPost } from "./types";

/**
 * The single entry point for reading a post.
 *
 * Every post is a story made of chapters. A story with one chapter reads as a
 * continuous article, a story with several reads as a paged photo essay.
 */
export default function Story({
    data,
    chapter = "0",
}: {
    data: StoryPost;
    chapter?: string;
}) {
    const chapters = parseStory(data.contents).chapters;
    const layout = resolveLayout(chapters.length, data.layout);

    if (layout === PAGED_LAYOUT) {
        return <PagedStory data={data} chapters={chapters} chapter={chapter} />;
    }

    return <ContinuousStory data={data} chapters={chapters} />;
}
