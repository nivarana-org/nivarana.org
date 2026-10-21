import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import { ViewTransition } from "react";

import { getArticlePublicURL, getImageURLFromFileName } from "@/utils/paths";
import type { Chapter } from "@/data/story";
import Sidebar from "@/app/(public)/_components/sidebar";

import PageShare from "../blocks/PageShare";
import AudioPlayer from "./AudioPlayer";
import ProgressTracker from "./ProgressTracker";
import StoryChapter from "./StoryChapter";
import StoryFooter from "./StoryFooter";
import StoryMeta from "./StoryMeta";
import type { StoryPost } from "./types";

/**
 * The continuous layout: the whole story is one long read, the way a plain
 * article reads today. A story with a single chapter renders exactly as an
 * article always has.
 */
export default function ContinuousStory({
    data,
    chapters,
}: {
    data: StoryPost;
    chapters: Chapter[];
}) {
    return (
        <>
            <div className="flex flex-col md:flex-row">
                <div className="flex flex-col justify-end bg-nivarana-white text-nivarana-charcoal">
                    <div className="my-auto"></div>
                    <div className="py-8 px-6">
                        <ViewTransition
                            name={`category-title-${data.categories[0].slug}`}
                        >
                            <div className="uppercase p-1 text-nivarana-charcoal md:text-xl">
                                <Link
                                    href={`/category/${data.categories[0].slug}`}
                                >
                                    {data.categories[0].name}
                                </Link>
                            </div>
                        </ViewTransition>
                        <ViewTransition name={`page-title-${data.slug}`}>
                            <h1 className="text-xl lg:text-3xl xl:text-4xl font-bold">
                                {data.title}
                            </h1>
                        </ViewTransition>
                        <p className="mt-6 text-sm lg:text-xl">{data.intro}</p>
                    </div>
                </div>
                <ViewTransition name={`page-lead-image-${data.slug}`}>
                    <div className="w-full md:w-1/2 md:shrink-0">
                        <Image
                            priority
                            fetchPriority="high"
                            src={getImageURLFromFileName(data.image)}
                            alt={"Representative image for " + data.title}
                            width={2000}
                            height={1414}
                            className="w-full h-auto"
                        />
                    </div>
                </ViewTransition>
            </div>
            <div className="flex flex-col md:flex-row max-w-7xl gap-x-8">
                {/* Authors */}
                <div className="px-2 mt-4 py-2 md:basis-2xs">
                    <StoryMeta data={data} />
                    <motion.div
                        className="hidden md:block md:sticky top-0 bg-nivarana-white/50 max-w-12"
                        initial={{ translateX: "-10px", opacity: 0 }}
                        whileInView={{ translateX: 0, opacity: 1 }}
                    >
                        <PageShare
                            url={getArticlePublicURL(data)}
                            media={data.image}
                            style="vertical"
                        ></PageShare>
                    </motion.div>
                </div>
                {/* Post */}
                <div className="md:basis-xl md:shrink-0">
                    <AudioPlayer
                        src={getImageURLFromFileName(`audio/${data.id}.mp3`)}
                    />
                    {chapters.map((chapter, index) => (
                        <StoryChapter
                            key={index}
                            chapter={chapter}
                            imageVariant="inline"
                        />
                    ))}
                </div>
                {/* Side */}
                <aside className="px-2 md:basis-3xs self-end mb-10">
                    Follow Nivarana on{" "}
                    <a
                        className="text-blue-800"
                        href="https://whatsapp.com/channel/0029Vb1kL5V9xVJjvHk25V0u"
                    >
                        WhatsApp
                    </a>
                    ,{" "}
                    <a
                        className="text-blue-800"
                        href="https://in.linkedin.com/company/nivaranaforindia"
                    >
                        LinkedIn
                    </a>
                    ,{" "}
                    <a
                        className="text-blue-800"
                        href="https://www.instagram.com/nivarana_for_india"
                    >
                        Instagram
                    </a>
                    , and{" "}
                    <a
                        className="text-blue-800"
                        href="https://twitter.com/Nivarana4India"
                    >
                        X
                    </a>{" "}
                    for updates. Also subscribe on{" "}
                    <a
                        className="text-blue-800"
                        href="https://youtube.com/@nivarana4India?feature=shared"
                    >
                        YouTube
                    </a>
                    .
                </aside>
                <ProgressTracker></ProgressTracker>
            </div>
            <PageShare
                url={getArticlePublicURL(data)}
                media={data.image}
            ></PageShare>
            <StoryFooter data={data} />
            <div className="lg:col-span-1">
                <Sidebar />
            </div>
        </>
    );
}
