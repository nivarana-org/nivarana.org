import { clearCache } from "@/app/(admin)/admin/articles/[id]/_components/post";
import ClearCache from "./_components/ClearCache";
import {
    getArticlesCount,
    getCommentsCount,
    getMediaCount,
    getPeopleCount,
    getPendingCommentsCount,
    getTotalViewsCount,
} from "./queries";
import Link from "next/link";
import { Suspense } from "react";

function DashboardItem({
    name,
    count,
    link,
    notification,
}: {
    name: string;
    count?: number;
    link?: string;
    /** Shows a small dot when there is something to review, e.g. pending comments. */
    notification?: boolean;
}) {
    if (link)
        return (
            <Link href={link}>
                <div className="relative p-4 bg-cyan-100 hover:bg-cyan-400 text-center">
                    {notification ? (
                        <span
                            title="There are pending comments"
                            aria-label="There are pending comments"
                            className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500"
                        ></span>
                    ) : null}
                    <div>{count ? <div>{count}</div> : null}</div>
                    <div>{name}</div>
                </div>
            </Link>
        );
    return (
        <div className="p-4 bg-cyan-400 text-center">
            <div>{count ? <div>{count}</div> : null}</div>
            <div>{name}</div>
        </div>
    );
}

export default async function Page() {
    const [
        articleCount,
        peopleCount,
        mediaCount,
        commentsCount,
        pendingCommentsCount,
        viewsCount,
    ] = await Promise.all([
        getArticlesCount(),
        getPeopleCount(),
        getMediaCount(),
        getCommentsCount(),
        getPendingCommentsCount(),
        getTotalViewsCount(),
    ]);

    return (
        <div className="max-w-(--breakpoint-md) mx-auto">
            <div className="my-2 p2 flex gap-2">
                <DashboardItem
                    name="Articles"
                    link="/admin/articles"
                    count={articleCount}
                ></DashboardItem>
                <DashboardItem
                    name="People"
                    link="/admin/people"
                    count={peopleCount}
                ></DashboardItem>
                <DashboardItem
                    name="Media"
                    link="/admin/media"
                    count={mediaCount}
                ></DashboardItem>
                <DashboardItem
                    name="Comments"
                    link="/admin/comments"
                    count={commentsCount}
                    notification={pendingCommentsCount > 0}
                ></DashboardItem>
                <div></div>
                <DashboardItem
                    name="Total Views"
                    count={viewsCount}
                ></DashboardItem>
            </div>
            <hr />
            <div className="my-2 p2 flex gap-2">
                <DashboardItem name="Pages" link="/admin/pages"></DashboardItem>
                <DashboardItem
                    name="Categories"
                    link="/admin/categories"
                ></DashboardItem>
                <DashboardItem name="Tags" link="/admin/tags"></DashboardItem>
                <DashboardItem
                    name="Redirects"
                    link="/admin/redirects"
                ></DashboardItem>
            </div>
            <h2 className="mb-4 text-4xl">Actions</h2>
            <div className="p2 flex gap-2">
                <Suspense>
                    <ClearCache clearCache={clearCache} />
                </Suspense>
            </div>
        </div>
    );
}
