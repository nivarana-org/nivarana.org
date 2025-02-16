import moment from "moment";
import { NAuthors } from "../authors/Authors";
import { NAuthorsBio } from "../authors/Bios";
import Image from "next/image";
import PageShare from "./PageShare";
import { Suspense } from "react";
import ViewCountUpdateOnly from "./ViewUpdateOnly";
import { getImageURLFromFileName } from "@/utils/paths";
import BodyWithPopover from "./BodyWithPopover";
import PageTranslate from "./PageTranslate";

function Article({ data }) {
    return (
        <>
            <div className="post post-single">
                <div className="post-header">
                    <h1 className="text-3xl font-bold mt-0 mb-3 p-2">
                        {data.page_title}
                    </h1>
                    <div className="mb-3">
                        <p className="text-lg text-gray-600 p-2">
                            {data.meta_description}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4 p-2">
                        <ul className="flex space-x-2 text-sm text-gray-500 list-none items-center">
                            <NAuthors authors={data.authors} />
                            <li>
                                {moment(data.created_at).format(
                                    "MMMM DD, YYYY",
                                )}
                            </li>
                            <PageTranslate
                                url={
                                    "https://nivarana.org/article/" + data.path
                                }
                            />
                            <Suspense>
                                <ViewCountUpdateOnly
                                    id={data.id}
                                    count={data.total_views}
                                />
                            </Suspense>
                        </ul>
                    </div>
                </div>
                <div className="mt-6">
                    <Image
                        src={getImageURLFromFileName(data.upload_image)}
                        alt={data.image_text}
                        width={1280}
                        height={900}
                        className="w-full h-auto"
                    />
                </div>
                <BodyWithPopover body={data.description} />
            </div>
            <div className="text-black font-bold p-2">Share</div>
            <PageShare
                className="p-2"
                url={"https://nivarana.org/article/" + data.path}
                media={data.upload_image}
            ></PageShare>
            <NAuthorsBio authors={data.authors} />
        </>
    );
}

export default Article;
