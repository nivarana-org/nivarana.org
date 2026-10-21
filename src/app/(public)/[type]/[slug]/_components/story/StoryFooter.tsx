import { getArticlePublicURL } from "@/utils/paths";

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
            <div className="max-w-2xl mx-auto">
                <div className="text-black font-bold p-2">Share</div>
                <PageShare
                    className="p-2"
                    url={getArticlePublicURL(data)}
                    media={data.image}
                ></PageShare>
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
