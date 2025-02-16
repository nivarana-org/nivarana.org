import { clearCache } from "@/actions/post";
import ClearCache from "@/components/admin/ClearCache";
import {
    getArticlesCount,
    getPeopleCount,
    getSubscribersCount,
    getTotalViewsCount,
    getWebPushSubscriberCount,
} from "@/data/cms";
import Link from "next/link";
import { Suspense } from "react";

function DashboardItem({
    name,
    count,
    link,
}: {
    name: string;
    count?: number;
    link?: string;
}) {
    if (link)
        return (
            <Link href={link}>
                <div className="p-4 bg-cyan-100 hover:bg-cyan-400 text-center">
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
        newsletterSubscriberCount,
        articleCount,
        webNotificationSubscriberCount,
        peopleCount,
        viewsCount,
    ] = await Promise.all([
        getSubscribersCount(),
        getArticlesCount(),
        getWebPushSubscriberCount(),
        getPeopleCount(),
        getTotalViewsCount(),
    ]);

    return (
        <div className="max-w-screen-md mx-auto">
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
                <div></div>
                <DashboardItem
                    name="Total Views"
                    count={viewsCount}
                ></DashboardItem>
            </div>
            <hr />
            <div className="my-2 p2 flex gap-2">
                <DashboardItem
                    name="Newsletter Subscribers"
                    link="/admin/newsletter"
                    count={newsletterSubscriberCount}
                ></DashboardItem>
                <DashboardItem
                    name="Web Notifications Subscribers"
                    link="/admin/push-notifications"
                    count={webNotificationSubscriberCount}
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
