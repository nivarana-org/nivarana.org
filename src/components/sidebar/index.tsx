import { Suspense } from "react";
import NewsletterBox from "../newsletter";
import { PushNotificationManager } from "../notifications";
import PopularPosts from "./popular";
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
        </div>
    );
}

export default Sidebar;
