import { PAGED_LAYOUT, parseStory, resolveLayout } from "@/data/story";

import {
    getImageFilenameFromSource,
    imageFilenamesFromHtml,
} from "../../_lib/mediaCredits";
import { getMediaCreditsByFilenames } from "../../queries";
import ContinuousStory from "./ContinuousStory";
import PagedStory from "./PagedStory";
import type { StoryPost } from "./types";

/**
 * The single entry point for reading a post.
 *
 * Every post is a story made of chapters. A story with one chapter reads as a
 * continuous article, a story with several reads as a paged photo essay.
 */
export default async function Story({
    data,
    chapter = "0",
}: {
    data: StoryPost;
    chapter?: string;
}) {
    const chapters = parseStory(data.contents).chapters;
    const layout = resolveLayout(chapters.length, data.layout);

    const filenames = new Set<string>();
    const heroFilename = getImageFilenameFromSource(data.image);
    if (heroFilename) {
        filenames.add(heroFilename);
    }
    for (const storyChapter of chapters) {
        const chapterFilename = getImageFilenameFromSource(storyChapter.image);
        if (chapterFilename) {
            filenames.add(chapterFilename);
        }
        for (const filename of imageFilenamesFromHtml(storyChapter.body)) {
            filenames.add(filename);
        }
    }
    const credits = await getMediaCreditsByFilenames([...filenames]);

    if (layout === PAGED_LAYOUT) {
        return (
            <PagedStory
                data={data}
                chapters={chapters}
                chapter={chapter}
                credits={credits}
            />
        );
    }

    return (
        <ContinuousStory data={data} chapters={chapters} credits={credits} />
    );
}
