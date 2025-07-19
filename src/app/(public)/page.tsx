import { getCategoriesForFrontPage } from "@/data/cms";
import { getArticleSlug, getImageURLFromFileName } from "@/utils/paths";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
    const categories = await getCategoriesForFrontPage();
    return (
        <div className="max-w-screen-xl mx-auto py-8 px-4 font-serif">
            <div className="flex flex-col gap-12">
                {categories.map((c) => (
                    <div
                        key={c.path}
                        className="pb-8 border-b border-gray-300 last:border-b-0"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold uppercase mb-6 text-gray-900 border-b-2 border-gray-900 inline-block pb-1">
                            {c.name}
                        </h2>
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Prominent Latest Article */}
                            {c.articles[0] && (
                                <div className="group flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden lg:w-2/3">
                                    <Link
                                        href={getArticleSlug({
                                            category: c.articles[0].category[0],
                                            path: c.articles[0].path,
                                            type: c.articles[0].type,
                                        })}
                                        className="block" // Ensure Link behaves like a block to contain image
                                    >
                                        <div className="relative w-full pt-[56.25%]">
                                            <Image
                                                src={getImageURLFromFileName(
                                                    c.articles[0].upload_image,
                                                )}
                                                alt={c.articles[0].page_title}
                                                fill
                                                sizes="(max-width: 1024px) 100vw, 66vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                                            />
                                        </div>
                                    </Link>
                                    <div className="p-5 flex flex-col justify-between flex-grow">
                                        <Link
                                            href={getArticleSlug({
                                                category:
                                                    c.articles[0].category[0],
                                                path: c.articles[0].path,
                                                type: c.articles[0].type,
                                            })}
                                            className="block" // Ensure Link behaves like a block for the heading
                                        >
                                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight group-hover:underline transition-colors duration-200">
                                                {c.articles[0].page_title}
                                            </h3>
                                        </Link>

                                        {/* Meta Description (Excerpt) */}
                                        {c.articles[0].meta_description && (
                                            <p className="text-gray-700 mt-3 text-lg line-clamp-3">
                                                {c.articles[0].meta_description}
                                            </p>
                                        )}
                                        {/* Authors and Published Time */}
                                        {(c.articles[0].authors ||
                                            c.articles[0].published_time) && (
                                            <div className="text-sm text-gray-500 mt-3 flex flex-wrap items-center gap-x-2">
                                                {c.articles[0].authors && (
                                                    <span>
                                                        By{" "}
                                                        <span className="font-medium text-gray-700">
                                                            {c.articles[0].authors.map(
                                                                (
                                                                    author,
                                                                    index,
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            author.id
                                                                        }
                                                                        className="inline-flex items-center"
                                                                    >
                                                                        <Link
                                                                            href={`/author/${author.path}`}
                                                                            className="p-1 rounded-sm hover:bg-cyan-200 hover:text-cyan-800 transition-colors duration-200"
                                                                        >
                                                                            {
                                                                                author.name
                                                                            }
                                                                        </Link>
                                                                        {index <
                                                                            c
                                                                                .articles[0]
                                                                                .authors
                                                                                .length -
                                                                                1 &&
                                                                            " and "}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </span>
                                                    </span>
                                                )}
                                                {c.articles[0]
                                                    .published_time && (
                                                    <>
                                                        {c.articles[0]
                                                            .authors && (
                                                            <span className="hidden sm:inline">
                                                                |
                                                            </span>
                                                        )}{" "}
                                                        <span>
                                                            {moment(
                                                                c.articles[0]
                                                                    .published_time,
                                                            ).format(
                                                                "MMMM DD, YYYY",
                                                            )}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Other 4 Less Prominent Articles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 lg:w-1/3">
                                {c.articles.slice(1, 5).map((a) => (
                                    <div
                                        key={a.path}
                                        className="group flex items-center bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200"
                                    >
                                        <Link
                                            href={getArticleSlug({
                                                category: a.category[0],
                                                path: a.path,
                                                type: a.type,
                                            })}
                                            className="flex-shrink-0 mr-3 block"
                                        >
                                            <div className="relative w-24 h-16">
                                                <Image
                                                    src={getImageURLFromFileName(
                                                        a.upload_image,
                                                    )}
                                                    alt={a.page_title}
                                                    fill
                                                    sizes="(max-width: 1024px) 33vw, 10vw"
                                                    className="object-cover rounded group-hover:opacity-80 transition-opacity duration-200"
                                                />
                                            </div>
                                        </Link>
                                        <div className="flex flex-col flex-grow">
                                            <Link
                                                href={getArticleSlug({
                                                    category: a.category[0],
                                                    path: a.path,
                                                    type: a.type,
                                                })}
                                                className="block"
                                            >
                                                <h4 className="text-base font-semibold text-gray-800 leading-snug line-clamp-3 group-hover:underline transition-colors duration-200">
                                                    {a.page_title}
                                                </h4>
                                            </Link>
                                            {/* Authors and Published Time for smaller articles */}
                                            {(a.authors ||
                                                a.published_time) && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {a.authors && (
                                                        <span>
                                                            By{" "}
                                                            <span className="font-medium">
                                                                {a.authors.map(
                                                                    (
                                                                        author,
                                                                        index,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                author.id
                                                                            }
                                                                            className="inline-flex items-center"
                                                                        >
                                                                            <Link
                                                                                href={`/author/${author.path}`}
                                                                                className="p-1 rounded-sm hover:bg-cyan-200 hover:text-cyan-800 transition-colors duration-200"
                                                                            >
                                                                                {
                                                                                    author.name
                                                                                }
                                                                            </Link>
                                                                            {index <
                                                                                a
                                                                                    .authors
                                                                                    .length -
                                                                                    1 &&
                                                                                " and "}
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </span>
                                                        </span>
                                                    )}
                                                    {a.published_time && (
                                                        <>
                                                            {a.authors && " | "}
                                                            <span>
                                                                {moment(
                                                                    a.published_time,
                                                                ).format(
                                                                    "MMM DD, YYYY",
                                                                )}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
