import { Suspense } from "react";
import NewsletterBox from "../newsletter";
import { PushNotificationManager } from "../notifications";
import PopularPosts from "./popular";
import RecentPosts from "./recent";
import Search from "../search/sidebar-search";

function Sidebar() {
    return (
        <div className="sidebar">
            <Search placeholder="Find articles" />
            <PopularPosts></PopularPosts>
            <NewsletterBox></NewsletterBox>
            <Suspense>
                <PushNotificationManager />
            </Suspense>
            <RecentPosts></RecentPosts>
        </div>
    );
}

export default Sidebar;
