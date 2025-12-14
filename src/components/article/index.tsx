import moment from "moment";
import { NAuthorsBio } from "../authors/Bios";
import Image from "next/image";
import PageShare from "@/components/blocks/PageShare";
import { Suspense } from "react";
import ViewCountUpdateOnly from "@/components/blocks/ViewUpdateOnly";
import { getArticlePublicURL, getImageURLFromFileName } from "@/utils/paths";
import BodyWithPopover from "./BodyWithPopover";
import PageTranslate from "@/components/blocks/PageTranslate";
import Link from "next/link";
import ProgressTracker from "./ProgressTracker";
import * as motion from "motion/react-client";
import { ViewTransition } from "react";
import AudioPlayer from "./AudioPlayer";

function Article({ data }) {
    return (
        <>
            <div className="flex flex-col md:flex-row">
                <div className="flex flex-col justify-end bg-nivarana-white text-nivarana-charcoal">
                    <div className="my-auto"></div>
                    <div className="py-8 px-6">
                        <ViewTransition
                            name={`category-title-${data.category[0].path}`}
                        >
                            <div className="uppercase p-1 text-nivarana-charcoal md:text-xl">
                                <Link
                                    href={`/category/${data.category[0].path}`}
                                >
                                    {data.category[0].name}
                                </Link>
                            </div>
                        </ViewTransition>
                        <ViewTransition name={`page-title-${data.path}`}>
                            <h1 className="text-xl lg:text-3xl xl:text-4xl font-bold">
                                {data.page_title}
                            </h1>
                        </ViewTransition>
                        <p className="mt-6 text-sm lg:text-xl">
                            {data.meta_description}
                        </p>
                    </div>
                </div>
                <ViewTransition name={`page-lead-image-${data.path}`}>
                    <div className="w-full md:w-1/2 md:shrink-0">
                        <Image
                            src={getImageURLFromFileName(data.upload_image)}
                            alt={"Representative image for " + data.page_title}
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
                    {data.authors.map((a) => (
                        <div
                            key={a.id}
                            className="p-1 hover:bg-cyan-200 text-black text-md font-bold"
                        >
                            <Link href={"/author/" + a.path}>{a.name}</Link>
                        </div>
                    ))}
                    <div className="p-1">
                        Published:{" "}
                        {moment(data.created_at).format("MMMM DD, YYYY")}
                    </div>
                    <div className="flex">
                        <PageTranslate url={getArticlePublicURL(data)} />
                    </div>
                    <Suspense>
                        <ViewCountUpdateOnly
                            id={data.id}
                            count={data.total_views}
                        />
                    </Suspense>
                    <motion.div
                        className="hidden md:block md:sticky top-0 bg-nivarana-white/50 max-w-12"
                        initial={{ translateX: "-10px", opacity: 0 }}
                        whileInView={{ translateX: 0, opacity: 1 }}
                    >
                        <PageShare
                            url={getArticlePublicURL(data)}
                            media={data.upload_image}
                            style="vertical"
                        ></PageShare>
                    </motion.div>
                </div>
                {/* Post */}
                <div className="md:basis-xl md:shrink-0">
                    <AudioPlayer
                        src={getImageURLFromFileName(`audio/${data.id}.mp3`)}
                    />
                    <BodyWithPopover body={data.description} />
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
                media={data.upload_image}
            ></PageShare>
            <NAuthorsBio authors={data.authors} />
        </>
    );
}

export default Article;
