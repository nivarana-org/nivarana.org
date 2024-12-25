"use client";
import { useEffect, useRef, useState } from "react";
import ArticlePreview from "../article/ArticlePreview";
import { getPostsOfPage } from "@/network/api";
import { Post } from "@/types/nivarana";

export default function LoadMore({ }) {
    const [page, setPage] = useState(2);
    const [posts, setPosts] = useState<Post[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    const loaderRef = useRef(null);
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

    const loadDelayed = () => {
        const timer = setTimeout(() => {
            loadMore();
        }, 3000)
        return timer;
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            const first = entries[0];
            if (first.isIntersecting && hasMore && !loading) {
              const timerId = loadDelayed();
              setTimer(timerId)
            }
          },
          {
            threshold: 1.0,
            rootMargin: '0px'
          }
        );

        if (loaderRef.current) {
          observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
      }, [hasMore, loading, page]);
    return <>
        {posts.map((item) => (
            <ArticlePreview {...item} key={item.path} />
        ))}
        <div ref={loaderRef} className="flex flex-col items-center">
            <LoadButton loading={loading} loadMore={loadMore} hasMore={hasMore} />
        </div>
    </>
}

function LoadButton({loading, hasMore, loadMore}) {
    if (!hasMore) return;
    if (loading) return <div>Loading...</div>
    return <button onClick={loadMore}>Load More</button>
}