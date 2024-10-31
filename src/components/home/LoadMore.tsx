"use client";
import { useState } from "react";
import ArticlePreview from "../article/ArticlePreview";
import { getPostsOfPage } from "@/network/api";
import { Post } from "@/types/nivarana";

export default function LoadMore({ }) {
    const [page, setPage] = useState(2);
    const [posts, setPosts] = useState<Post[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const loadMore = async () => {
        setLoading(true);
        const morePosts = await getPostsOfPage(page);
        if (morePosts.length > 0) {
            setPosts([...posts, ...morePosts])
            setPage(page + 1);
            setLoading(false);
        } else {
            setHasMore(false);
        }
        
    }
    return <>
        {posts.map((item) => (
            <ArticlePreview {...item} key={item.path} />
        ))}
        <div className="flex flex-col items-center">
            <LoadButton loading={loading} loadMore={loadMore} hasMore={hasMore} />
        </div>
    </>
}

function LoadButton({loading, hasMore, loadMore}) {
    if (!hasMore) return;
    if (loading) return <div>Loading...</div>
    return <button onClick={loadMore}>Load More</button>
}