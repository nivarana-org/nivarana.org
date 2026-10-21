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
 */
export default function StoryMeta({
    data,
    variant = "block",
}: {
    data: StoryPost;
    variant?: "block" | "overlay";
}) {
    const overlay = variant === "overlay";
    return (
        <>
            <ul
                className={
                    overlay
                        ? "z-10 flex space-x-2 list-none items-center flex-wrap"
                        : "list-none p-0 m-0"
                }
            >
                {data.authors.map((a) => (
                    <li
                        key={a.id}
                        className={
                            overlay
                                ? "list-inline-item border p-1 rounded-sm text-white hover:bg-cyan-200"
                                : "p-1 hover:bg-cyan-200 text-black text-md font-bold"
                        }
                    >
                        <Link href={"/author/" + a.slug}>{a.name}</Link>
                    </li>
                ))}
                <li className={overlay ? "text-white" : "p-1"}>
                    {overlay
                        ? moment(data.created_at).format("MMMM DD, YYYY")
                        : `Published: ${moment(data.created_at).format(
                              "MMMM DD, YYYY",
                          )}`}
                </li>
                <li className={overlay ? "" : "flex"}>
                    <PageTranslate url={getArticlePublicURL(data)} />
                </li>
                <li>
                    <Suspense>
                        <ViewCountUpdateOnly id={data.id} count={data.views} />
                    </Suspense>
                </li>
            </ul>
            {data.tags.length > 0 && (
                <ul
                    className={
                        overlay
                            ? "z-10 list-disc pl-5 text-sm text-white"
                            : "list-disc pl-5 p-1 text-sm text-black"
                    }
                >
                    {data.tags.map((t) => (
                        <li
                            key={t.id}
                            className={overlay ? "" : "hover:bg-cyan-200"}
                        >
                            <Link href={`/tag/${t.slug}`}>{t.name}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
