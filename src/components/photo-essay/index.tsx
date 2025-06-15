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
import ZoomableImage from "./ZoomableImage";
import { Button } from "@mui/joy";
import ScrollToTop from "./ScrollToTop";
import ClearChapter from "./ClearChapter";

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
            {image ? (
                <ZoomableImage
                    src={getImageURLFromFileName(image)}
                ></ZoomableImage>
            ) : null}
            {title ? (
                <div className="max-w-4xl mx-auto text-4xl text-black mt-8 p-2">
                    {title}
                </div>
            ) : null}

            <BodyWithPopover body={body} />
        </>
    );
}

function PhotoEssay({ data, chapter }) {
    const { chapters } = JSON.parse(data.description);
    const singlePage = chapter === "all";
    const page = singlePage ? 0 : Number(chapter);
    if (singlePage)
        return (
            <>
                <div className="post post-single">
                    <div className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-8 pb-80 pt-80 mx-auto mt-24">
                        <Image
                            src={getImageURLFromFileName(data.upload_image)}
                            alt={
                                data.image_text ??
                                "sorry, we aren't having alt support now"
                            }
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
                                    url={`https://nivarana.org/${data.type}/${data.path}`}
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
                    <ClearChapter></ClearChapter>
                    {chapters.map((c, index: number) => (
                        <PhotoChapter key={index} {...c} />
                    ))}
                </div>
                <div className="max-w-2xl mx-auto">
                    <div className="text-black font-bold p-2">Share</div>
                    <PageShare
                        className="p-2"
                        url={`https://nivarana.org/${data.type}/${data.path}`}
                        media={data.upload_image}
                    ></PageShare>
                </div>
                <NAuthorsBio authors={data.authors} />
            </>
        );
    if (page === 0)
        return (
            <>
                <div className="post post-single">
                    <div className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-8 pb-80 pt-80 mx-auto mt-24">
                        <Image
                            src={getImageURLFromFileName(data.upload_image)}
                            alt={
                                data.image_text ??
                                "sorry, we aren't having alt support now"
                            }
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
                                    url={`https://nivarana.org/${data.type}/${data.path}`}
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
                    <ClearChapter></ClearChapter>
                    <PhotoChapter {...chapters[0]} />

                    <div className="max-w-2xl mx-auto text-4xl text-black mt-8 p-2 flex justify-between">
                        <Button>
                            <Link
                                href={{
                                    query: { chapter: "all" },
                                }}
                            >
                                View in Single Page
                            </Link>
                        </Button>
                        <Button>
                            <Link
                                href={{
                                    query: { chapter: "1" },
                                }}
                            >
                                Start
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="max-w-2xl mx-auto">
                    <div className="text-black font-bold p-2">Share</div>
                    <PageShare
                        className="p-2"
                        url={`https://nivarana.org/${data.type}/${data.path}`}
                        media={data.upload_image}
                    ></PageShare>
                </div>
                <NAuthorsBio authors={data.authors} />
            </>
        );
    const lastPage = page + 1 === chapters.length;
    return (
        <>
            <div className="post post-single">
                <div className="mt-6"></div>
                <ScrollToTop />
                <ClearChapter></ClearChapter>
                <PhotoChapter {...chapters[page]} />

                <div className="max-w-2xl mx-auto text-4xl text-black mt-8 p-2 flex justify-between">
                    <Button>
                        <Link
                            href={{
                                query: { chapter: `${page - 1}` },
                            }}
                        >
                            Previous
                        </Link>
                    </Button>

                    {!lastPage ? (
                        <Button>
                            <Link
                                href={{
                                    query: { chapter: `${page + 1}` },
                                }}
                            >
                                Next
                            </Link>
                        </Button>
                    ) : (
                        <Button>
                            <Link
                                href={{
                                    query: { chapter: `0` },
                                }}
                            >
                                Restart
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
            <div className="max-w-2xl mx-auto">
                <div className="text-black font-bold p-2">Share</div>
                <PageShare
                    className="p-2"
                    url={`https://nivarana.org/${data.type}/${data.path}`}
                    media={data.upload_image}
                ></PageShare>
            </div>
            {lastPage ? <NAuthorsBio authors={data.authors} /> : null}
        </>
    );
}

export default PhotoEssay;
