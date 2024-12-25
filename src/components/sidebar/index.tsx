import { Suspense } from "react";
import NewsletterBox from "../newsletter";
import { PushNotificationManager } from "../notifications";
import PopularPosts from "./popular";
import RecentPosts from "./recent";

function Sidebar() {
    return (
        <div className="sidebar">
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
