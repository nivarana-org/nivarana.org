import moment from "moment";
import { NAuthors } from "../authors/Authors";
import { NAuthorsBio } from "../authors/Bios";
import Image from "next/image";
import PageShare from "@/components/blocks/PageShare";
import { Suspense } from "react";
import ViewCountUpdateOnly from "@/components/blocks/ViewUpdateOnly";
import { getArticlePublicURL, getImageURLFromFileName } from "@/utils/paths";
import BodyWithPopover from "./BodyWithPopover";
import PageTranslate from "@/components/blocks/PageTranslate";

function Article({ data }) {
    return (
        <>
            <div className="flex flex-col lg:flex-row">
                <div className="flex flex-col justify-end bg-maybe text-nivarana-charcoal">
                    <div className="my-auto"></div>
                    <div className="py-8 px-6">
                        <h1 className="text-3xl xl:text-5xl font-bold">
                            {data.page_title}
                        </h1>
                        <p className="mt-6 text-xl">{data.meta_description}</p>
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
            <div className="flex flex-col lg:flex-row max-w-7xl gap-x-8">
                {/* Authors */}
                <div className="px-2 basis-2xs">
                    <NAuthors authors={data.authors} />
                    <div>
                        Published:{" "}
                        {moment(data.created_at).format("MMMM DD, YYYY")}
                    </div>
                    <div className="flex justify-center">
                        <PageTranslate url={getArticlePublicURL(data)} />
                    </div>
                    <Suspense>
                        <ViewCountUpdateOnly
                            id={data.id}
                            count={data.total_views}
                        />
                    </Suspense>
                    <PageShare
                        className="p-2"
                        url={getArticlePublicURL(data)}
                        media={data.upload_image}
                    ></PageShare>
                </div>
                {/* Post */}
                <div className="basis-3xl">
                    <BodyWithPopover body={data.description} />
                </div>
                {/* Side */}
                <div className="px-2 basis-2xs"></div>
            </div>
            <div className="text-black font-bold p-2">Share</div>
            <PageShare
                className="p-2"
                url={getArticlePublicURL(data)}
                media={data.upload_image}
            ></PageShare>
            <NAuthorsBio authors={data.authors} />
        </>
    );
}

export default Article;
