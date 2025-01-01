"use client";
import { useEffect, useRef, useState } from "react";
import ArticlePreview from "../article/ArticlePreview";
import { Post } from "@/types/nivarana";
import { getArticlesPaginated } from "@/data/cms";

const usePosts = (startPage: number) => {
    const [page, setPage] = useState(startPage);
    const [posts, setPosts] = useState<Post[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [shouldAutoLoad, setAutoLoad] = useState(false);

    const loadMore = async () => {
        if (!hasMore) return;
        if (loading) return;
        setLoading(true);
        setAutoLoad(true);
        const morePosts = await getArticlesPaginated(page);
        if (morePosts.length > 0) {
            setPosts((posts) => [...posts, ...morePosts]);
            setPage((page) => page + 1);
            setLoading(false);
        } else {
            setHasMore(false);
        }
    };

    const autoLoad = () => {
        if (shouldAutoLoad) {
            loadMore();
        }
    };

    return {
        posts,
        hasMore,
        loading,
        loadMore,
        autoLoad,
    };
};

export default function LoadMore({}) {
    const { posts, hasMore, loading, loadMore, autoLoad } = usePosts(1);
    const loaderRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting) {
                    autoLoad();
                }
            },
            {
                threshold: 1.0,
                rootMargin: "0px",
            },
        );
        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }
        return () => {
            observer.disconnect();
        };
    }, [autoLoad]);
    return (
        <>
            {posts.map((item) => (
                <ArticlePreview {...item} key={item.path} />
            ))}
            <div ref={loaderRef} className="flex flex-col items-center">
                <LoadButton
                    loading={loading}
                    loadMore={loadMore}
                    hasMore={hasMore}
                />
            </div>
        </>
    );
}

function LoadButton({
    loading,
    hasMore,
    loadMore,
}: {
    loading: boolean;
    hasMore: boolean;
    loadMore: () => void;
}) {
    if (!hasMore) return;
    if (loading) return <div>Loading...</div>;
    return <button onClick={loadMore}>Load More</button>;
}
