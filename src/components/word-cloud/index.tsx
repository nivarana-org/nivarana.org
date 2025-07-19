import { getWordCloud } from "@/data/cms";
import WordCloudClient from "./client-index";
import { Suspense } from "react";

export default async function WordCloud() {
    const wordCloud = await getWordCloud();
    return (
        <div className="max-w-4xl mx-auto">
            <Suspense>
                <WordCloudClient wordCloud={wordCloud}></WordCloudClient>
            </Suspense>
        </div>
    );
}
