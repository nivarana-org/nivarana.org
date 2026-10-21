import moment from "moment";
import Link from "next/link";
import { Suspense } from "react";

import { getArticlePublicURL } from "@/utils/paths";

import PageTranslate from "../blocks/PageTranslate";
import ViewCountUpdateOnly from "../blocks/ViewUpdateOnly";
import type { StoryPost } from "./types";

/**
 * The byline of a story: authors, publication date, translation link, view
 * count and tags. Both layouts need the same information, only the styling
 * differs.
 *
 * The `block` variant is the one that sits above the article body: a single
 * horizontal row that reads as one line of metadata rather than a column of
 * disconnected facts.
 */
export default function StoryMeta({
    data,
    variant = "block",
}: {
    data: StoryPost;
    variant?: "block" | "overlay";
}) {
    if (variant === "overlay") {
        return (
            <>
                <ul className="z-10 flex space-x-2 list-none items-center flex-wrap">
                    {data.authors.map((a) => (
                        <li
                            key={a.id}
                            className="list-inline-item border p-1 rounded-sm text-white hover:bg-cyan-200"
                        >
                            <Link href={"/author/" + a.slug}>{a.name}</Link>
                        </li>
                    ))}
                    <li className="text-white">
                        {moment(data.created_at).format("MMMM DD, YYYY")}
                    </li>
                    <li className="flex">
                        <PageTranslate url={getArticlePublicURL(data)} />
                    </li>
                    <li>
                        <Suspense>
                            <ViewCountUpdateOnly
                                id={data.id}
                                count={data.views}
                            />
                        </Suspense>
                    </li>
                </ul>
                {data.tags.length > 0 && (
                    <ul className="z-10 list-disc pl-5 text-sm text-white">
                        {data.tags.map((t) => (
                            <li key={t.id}>
                                <Link href={`/tag/${t.slug}`}>{t.name}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </>
        );
    }

    return (
        <>
            <ul className="m-0 flex list-none flex-wrap items-center gap-x-5 gap-y-2 p-0 text-sm text-nivarana-charcoal">
                {data.authors.length > 0 && (
                    <li className="flex flex-wrap items-center gap-x-2">
                        <span className="text-nivarana-charcoal/60">By</span>
                        {data.authors.map((a) => (
                            <Link
                                key={a.id}
                                href={"/author/" + a.slug}
                                className="font-bold transition-colors hover:text-nivarana-green"
                            >
                                {a.name}
                            </Link>
                        ))}
                    </li>
                )}
                <li className="text-nivarana-charcoal/70">
                    {moment(data.created_at).format("MMMM DD, YYYY")}
                </li>
                <li className="flex items-center">
                    <PageTranslate url={getArticlePublicURL(data)} />
                </li>
                <li>
                    <Suspense>
                        <ViewCountUpdateOnly id={data.id} count={data.views} />
                    </Suspense>
                </li>
            </ul>
            {data.tags.length > 0 && (
                <ul className="mt-3 mb-0 flex list-none flex-wrap items-center gap-2 p-0 text-xs">
                    {data.tags.map((t) => (
                        <li key={t.id}>
                            <Link
                                href={`/tag/${t.slug}`}
                                className="inline-block rounded-full border border-nivarana-green/40 px-3 py-1 text-nivarana-green transition-colors hover:bg-nivarana-green hover:text-white"
                            >
                                {t.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
