import type { PostLayout, Story } from "@/data/story";

export type StoryAuthor = {
    id: number;
    slug: string;
    name: string;
    email?: string;
    bio?: string;
};

export type StoryTag = {
    id: number;
    slug: string;
    name: string;
};

export type StoryCategory = {
    id: number;
    slug: string;
    name: string;
};

/**
 * A published story, as returned by `getPost`. Every post on the site is a
 * story: an article is simply a story with a single chapter.
 */
export type StoryPost = {
    id: number;
    slug: string;
    title: string;
    intro: string | null;
    image: string | null;
    /**
     * The story document. Kysely's `ParseJSONResultsPlugin` hands us an
     * object whenever the stored value looks like JSON, so this is either
     * the parsed document or the raw JSON string — use `parseStory` to read.
     */
    contents: string | Story;
    created_at: Date;
    published_at: Date;
    views: number;
    layout: PostLayout;
    category: StoryCategory;
    tags: StoryTag[];
    authors: StoryAuthor[];
    comments_count: number;
};
