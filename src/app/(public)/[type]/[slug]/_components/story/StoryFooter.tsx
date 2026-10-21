import { getArticlePublicURL, getImageURLFromFileName } from "@/utils/paths";

import { READING_MEASURE } from "../../_lib/layout";
import { NAuthorsBio } from "../authors/Bios";
import PageShare from "../blocks/PageShare";
import CommentsSection from "../comments/CommentsSection";
import type { StoryPost } from "./types";

/**
 * The end of a story: sharing, the author bios and the comments.
 *
 * A paged story shows these only after its last chapter, so that the reader
 * reaches the discussion once they have finished the whole thing.
 */
export default function StoryFooter({
    data,
    showBios = true,
    showComments = true,
}: {
    data: StoryPost;
    showBios?: boolean;
    showComments?: boolean;
}) {
    return (
        <>
            <div className="mx-auto w-full max-w-7xl px-5 md:px-6 mt-12">
                <div className={`mx-auto w-full ${READING_MEASURE}`}>
                    <div className="mb-3 text-black font-bold">Share</div>
                    <PageShare
                        url={getArticlePublicURL(data)}
                        media={getImageURLFromFileName(data.image)}
                    ></PageShare>
                </div>
            </div>
            {showBios && <NAuthorsBio authors={data.authors} />}
            {showComments && (
                <CommentsSection
                    blogId={data.id}
                    initialCount={data.comments_count}
                />
            )}
        </>
    );
}
