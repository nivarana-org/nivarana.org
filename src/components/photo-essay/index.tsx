import moment from "moment";
import { NAuthorsBio } from "../authors/Bios";
import Image from "next/image";
import PageShare from "./PageShare";
import { Suspense } from "react";
import ViewCountUpdateOnly from "./ViewUpdateOnly";
import { getImageURLFromFileName } from "@/utils/paths";
import BodyWithPopover from "./BodyWithPopover";
import PageTranslate from "./PageTranslate";

import Link from "next/link";

function Author({ path, name }) {
    return (
        <li className="list-inline-item border p-1 rounded text-white hover:bg-cyan-200">
            <Link href={"/author/" + path}>{name}</Link>
        </li>
    );
}

function NAuthors({ authors }) {
    return authors.map((a) => <Author {...a} key={a.id} />);
}

function PhotoChapter({ title, body, image }) {
    return (
        <>
            <Image
                src={getImageURLFromFileName(image)}
                alt={"Sorry, we are in the process of creating alt"}
                width={1280}
                height={900}
                className="inset-0 h-full w-full object-cover"
            />
            <div className="max-w-4xl mx-auto text-4xl text-black mt-8">
                {title}
            </div>
            <BodyWithPopover body={body} />
        </>
    );
}

function PhotoEssay({ data }) {
    const { chapters } = JSON.parse(data.description);
    return (
        <>
            <div className="post post-single">
                <div className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-8 pb-80 pt-80 mx-auto mt-24">
                    <Image
                        src={getImageURLFromFileName(data.upload_image)}
                        alt={data.image_text}
                        width={1280}
                        height={900}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
                    <h3 className="z-10 mt-3 text-3xl font-bold text-white">
                        {data.page_title}
                    </h3>
                    <div className="z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                        {data.meta_description}
                    </div>
                    <div className="z-10 flex space-x-4 p-2 text-xl font-bold text-white">
                        <ul className="z-10 flex  space-x-2 list-none items-center">
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
                <div className="mt-6"></div>
                {chapters.map((c, index: number) => (
                    <PhotoChapter key={index} {...c} />
                ))}
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

export default PhotoEssay;
