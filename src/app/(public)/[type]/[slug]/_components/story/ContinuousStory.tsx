import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import { ViewTransition } from "react";

import { getArticlePublicURL, getImageURLFromFileName } from "@/utils/paths";
import type { Chapter } from "@/data/story";
import Sidebar from "@/app/(public)/_components/sidebar";

import { READING_MEASURE } from "../../_lib/layout";
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
            {/*
                The hero. The title block sits on the tan panel and the feature
                image fills the other half. Both halves live in one container
                so the split reads as a single block instead of two pieces
                that happen to touch.
            */}
            <div className="mx-auto w-full max-w-7xl">
                <div className="flex flex-col md:flex-row">
                    <div className="flex flex-col justify-end bg-nivarana-white text-nivarana-charcoal md:w-1/2 md:shrink-0">
                        <div className="px-6 py-8 md:px-10 md:py-12 lg:px-12 xl:px-16">
                            <ViewTransition
                                name={`category-title-${data.category.slug}`}
                            >
                                <div className="uppercase p-1 text-nivarana-charcoal md:text-xl">
                                    <Link
                                        href={`/category/${data.category.slug}`}
                                    >
                                        {data.category.name}
                                    </Link>
                                </div>
                            </ViewTransition>
                            <ViewTransition name={`page-title-${data.slug}`}>
                                <h1 className="text-xl lg:text-3xl xl:text-4xl font-bold">
                                    {data.title}
                                </h1>
                            </ViewTransition>
                            <p className="mt-6 text-sm lg:text-xl">
                                {data.intro}
                            </p>
                        </div>
                    </div>
                    <ViewTransition name={`page-lead-image-${data.slug}`}>
                        <div className="relative aspect-video w-full md:aspect-auto md:w-1/2 md:min-h-110 md:shrink-0 lg:min-h-130">
                            <Image
                                preload={true}
                                fetchPriority="high"
                                src={getImageURLFromFileName(data.image)}
                                alt={"Representative image for " + data.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                    </ViewTransition>
                </div>
            </div>
            {/*
                The reading area. The share rail follows the reader on the
                left, the byline and the audio version sit directly above the
                text, and everything shares one measure.
            */}
            <div className="mx-auto w-full max-w-7xl px-5 md:px-6">
                <div className="flex justify-center gap-8">
                    <aside className="hidden w-12 shrink-0 lg:block">
                        <motion.div
                            className="sticky top-24 flex flex-col items-center gap-3"
                            initial={{ translateX: "-10px", opacity: 0 }}
                            whileInView={{ translateX: 0, opacity: 1 }}
                        >
                            <PageShare
                                url={getArticlePublicURL(data)}
                                media={getImageURLFromFileName(data.image)}
                                style="vertical"
                            ></PageShare>
                        </motion.div>
                    </aside>
                    <article className={`w-full min-w-0 ${READING_MEASURE}`}>
                        <header className="mb-8 border-b border-nivarana-green/20 pb-6">
                            <StoryMeta data={data} />
                            <AudioPlayer
                                src={getImageURLFromFileName(
                                    `audio/${data.id}.mp3`,
                                )}
                            />
                        </header>
                        {chapters.map((chapter, index) => (
                            <StoryChapter
                                key={index}
                                chapter={chapter}
                                imageVariant="inline"
                            />
                        ))}
                        {/* Side */}
                        <aside className="mt-10 border-t border-nivarana-green/20 pt-6 text-sm leading-relaxed text-nivarana-charcoal/80">
                            Follow Nivarana on{" "}
                            <a
                                className="text-nivarana-blue underline"
                                href="https://whatsapp.com/channel/0029Vb1kL5V9xVJjvHk25V0u"
                            >
                                WhatsApp
                            </a>
                            ,{" "}
                            <a
                                className="text-nivarana-blue underline"
                                href="https://in.linkedin.com/company/nivaranaforindia"
                            >
                                LinkedIn
                            </a>
                            ,{" "}
                            <a
                                className="text-nivarana-blue underline"
                                href="https://www.instagram.com/nivarana_for_india"
                            >
                                Instagram
                            </a>
                            , and{" "}
                            <a
                                className="text-nivarana-blue underline"
                                href="https://twitter.com/Nivarana4India"
                            >
                                X
                            </a>{" "}
                            for updates. Also subscribe on{" "}
                            <a
                                className="text-nivarana-blue underline"
                                href="https://youtube.com/@nivarana4India?feature=shared"
                            >
                                YouTube
                            </a>
                            .
                        </aside>
                    </article>
                </div>
            </div>
            <StoryFooter data={data} />
            <div className="mx-auto w-full max-w-7xl px-5 md:px-6">
                <div className={`mx-auto w-full ${READING_MEASURE}`}>
                    <Sidebar />
                </div>
            </div>
            <ProgressTracker></ProgressTracker>
        </>
    );
}
