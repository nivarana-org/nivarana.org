import TagCloud from "./_components/tag-cloud";
import { getArticleSlug, getImageURLFromFileName } from "@/utils/paths";
import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import { ViewTransition } from "react";
import { getOverview } from "./queries";
import AuthorsAndPublishedTime from "./_components/AuthorsAndPublishedTime";

export default async function Home() {
    const categories = await getOverview();
    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="flex flex-col gap-12">
                {categories.map((c) => (
                    <Category key={c.slug} c={c}></Category>
                ))}
            </div>
            <TagCloud></TagCloud>
        </div>
    );
}

type Article = {
    slug: string;
    image: string;
    title: string;
    category: ArticleCategory;
    authors: ArticleAuthor[];
    intro: string;
    published_at: string;
};

type ArticleCategory = {
    slug: string;
    name: string;
};

type ArticleAuthor = {
    id: number;
    slug: string;
    name: string;
};

type CategoryProp = {
    c: {
        slug: string;
        name: string;
        articles: Article[];
    };
};

async function Category({ c }: CategoryProp) {
    return (
        <div className="pb-8 border-b border-gray-300 last:border-b-0">
            <ViewTransition name={`category-title-${c.slug}`}>
                <h2 className="text-3xl md:text-4xl font-bold uppercase mb-6 text-gray-900 border-b-2 border-gray-900 inline-block pb-1">
                    <Link href={`/category/${c.slug}`}>{c.name}</Link>
                </h2>
            </ViewTransition>
            <div className="flex flex-col lg:flex-row gap-6 justify-between">
                {/* Prominent Latest Article */}
                {c.articles[0] && (
                    <LatestArticle a={c.articles[0]}></LatestArticle>
                )}

                {/* Other 4 Less Prominent Articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 lg:w-1/3 grow">
                    {c.articles.slice(1, 5).map((a) => (
                        <RestArticles key={a.slug} a={a}></RestArticles>
                    ))}
                    <motion.div
                        whileHover={{ translateX: -10 }}
                        whileTap={{ translateX: -10 }}
                        className="flex flex-row justify-end-safe px-2"
                    >
                        <Link href={`/category/${c.slug}`}>Read More →</Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

async function LatestArticle({ a }: { a: Article }) {
    return (
        <div className="group flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden lg:w-2/3 xl:w-2xl ">
            <Link
                href={getArticleSlug({
                    category: a.category,
                    slug: a.slug,
                })}
                className="block"
            >
                <ViewTransition name={`page-lead-image-${a.slug}`}>
                    <div className="relative w-full max-h-100 pt-[70%]">
                        <Image
                            src={getImageURLFromFileName(a.image)}
                            alt={a.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 66vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                        />
                    </div>
                </ViewTransition>
            </Link>
            <div className="p-5 flex flex-col justify-between grow">
                <Link
                    href={getArticleSlug({
                        category: a.category,
                        slug: a.slug,
                    })}
                    className="block"
                >
                    <ViewTransition name={`page-title-${a.slug}`}>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight group-hover:underline transition-colors duration-200">
                            {a.title}
                        </h3>
                    </ViewTransition>
                </Link>

                {/* Meta Description (Excerpt) */}
                {a.intro && (
                    <p className="text-gray-700 mt-3 text-md md:text-base md:line-clamp-4">
                        {a.intro}
                    </p>
                )}
                <div className="text-xs">
                    <AuthorsAndPublishedTime
                        authors={a.authors}
                        published_at={a.published_at}
                    ></AuthorsAndPublishedTime>
                </div>
            </div>
        </div>
    );
}

async function RestArticles({ a }: { a: Article }) {
    return (
        <div className="group flex items-center bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
            <Link
                href={getArticleSlug({
                    category: a.category,
                    slug: a.slug,
                })}
                className="shrink-0 mr-3 block"
            >
                <ViewTransition name={`page-lead-image-${a.slug}`}>
                    <div className="relative w-23 h-16 lg:w-42 lg:h-30">
                        <Image
                            src={getImageURLFromFileName(a.image)}
                            alt={a.title}
                            fill
                            sizes="(max-width: 1024px) 33vw, 10vw"
                            className="object-cover rounded group-hover:opacity-80 transition-opacity duration-200"
                        />
                    </div>
                </ViewTransition>
            </Link>
            <div className="flex flex-col grow">
                <Link
                    href={getArticleSlug({
                        category: a.category,
                        slug: a.slug,
                    })}
                    className="block"
                >
                    <ViewTransition name={`page-title-${a.slug}`}>
                        <h4 className="text-base font-semibold text-gray-800 leading-snug line-clamp-4 group-hover:underline transition-colors duration-200">
                            {a.title}
                        </h4>
                    </ViewTransition>
                </Link>
                <div className="text-xs">
                    <AuthorsAndPublishedTime
                        authors={a.authors}
                        published_at={a.published_at}
                    ></AuthorsAndPublishedTime>
                </div>
            </div>
        </div>
    );
}

export const metadata = {
    alternates: {
        canonical: "https://nivarana.org",
        types: {
            "application/rss+xml": "https://nivarana.org/feed/rss.xml",
            "application/atom+xml": "https://nivarana.org/feed/atom.xml",
            "application/feed+json": "https://nivarana.org/feed/feed.json",
        },
    },
};
