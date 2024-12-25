"use client";
import { useEffect, useRef, useState } from "react";
import ArticlePreview from "../article/ArticlePreview";
import { getPostsOfPage } from "@/network/api";
import { Post } from "@/types/nivarana";

const usePosts = (startPage: number) => {
  const [page, setPage] = useState(startPage);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadMore = async () => {
    if (!hasMore) return;
    if (loading) return;
    setLoading(true);
    const morePosts = await getPostsOfPage(`${page}`);
    if (morePosts.length > 0) {
      setPosts((posts) => [...posts, ...morePosts])
      setPage((page) => page + 1);
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

  return {
    posts,
    hasMore,
    loading,
    loadMore,
    loadDelayed
  }
}

export default function LoadMore({}) {
  const {posts, hasMore, loading, loadMore, loadDelayed} = usePosts(2);
  const loaderRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadDelayed();
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
    return () => {
      observer.disconnect()
    };
  }, [loadDelayed]);
  return <>
    {posts.map((item) => (
      <ArticlePreview {...item} key={item.path} />
    ))}
    <div ref={loaderRef} className="flex flex-col items-center">
      <LoadButton loading={loading} loadMore={loadMore} hasMore={hasMore} />
    </div>
  </>
}

function LoadButton({ loading, hasMore, loadMore }: {loading: boolean, hasMore: boolean, loadMore: () => void}) {
  if (!hasMore) return;
  if (loading) return <div>Loading...</div>
  return <button onClick={loadMore}>Load More</button>
}