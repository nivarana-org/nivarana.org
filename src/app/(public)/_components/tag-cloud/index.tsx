import { Suspense } from "react";

import { getTagCloud } from "../../queries";

import TagCloudClient from "./client-index";

export default async function TagCloud() {
    const tags = await getTagCloud();
    return (
        <div className="max-w-4xl mx-auto">
            <Suspense>
                <TagCloudClient tags={tags}></TagCloudClient>
            </Suspense>
        </div>
    );
}
