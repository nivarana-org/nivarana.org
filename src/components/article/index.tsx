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

function Article({ data }) {
    return (
        <>
            <div className="flex flex-col md:flex-row">
                <div className="flex flex-col justify-end bg-maybe text-nivarana-charcoal">
                    <div className="my-auto"></div>
                    <div className="py-8 px-6">
                        <div className="uppercase p-1 text-nivarana-charcoal md:text-xl">
                            <Link href={`/category/${data.category[0].path}`}>
                                {data.category[0].name}
                            </Link>
                        </div>
                        <h1 className="text-xl lg:text-3xl xl:text-5xl font-bold">
                            {data.page_title}
                        </h1>
                        <p className="mt-6 lg:text-xl">
                            {data.meta_description}
                        </p>
                    </div>
                </div>
                <div>
                    <Image
                        src={getImageURLFromFileName(data.upload_image)}
                        alt={data.image_text}
                        width={1280}
                        height={900}
                        className="w-full h-auto"
                    />
                </div>
            </div>
            <div className="flex flex-col md:flex-row max-w-7xl gap-x-8">
                {/* Authors */}
                <div className="px-2 mt-4 py-2 md:basis-2xs">
                    {data.authors.map((a) => (
                        <div
                            key={a.id}
                            className="p-1 hover:bg-cyan-200 text-black text-xl"
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
                <div className="md:basis-3xl">
                    <BodyWithPopover body={data.description} />
                </div>
                {/* Side */}
                <div className="px-2 md:basis-2xs"></div>
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
