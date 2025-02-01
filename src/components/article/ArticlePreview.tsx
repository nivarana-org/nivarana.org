import moment from "moment";
import Link from "next/link";
import React from "react";
import { NAuthors } from "../authors/Authors";
import { Post } from "@/types/nivarana";
import Image from "next/image";

function ArticlePreview({
    path,
    authors,
    authors_data,
    author,
    upload_image,
    page_title,
    meta_description,
    created_at,
    category,
    aboveTheFold = false,
    includeCategory = false,
}: Post & { aboveTheFold?: boolean; includeCategory?: boolean }) {
    return (
        <div className="flex flex-wrap">
            {includeCategory ? (
                <div className="p-3 grow-0 w-30">
                    <Link
                        href={"/category/" + category.path}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        {category.name}
                    </Link>
                </div>
            ) : null}
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl mb-3 grow shrink:0 hover:drop-shadow-xl">
                <div className="md:flex">
                    <div className="md:shrink-0">
                        <Link href={"/article/" + path}>
                            <Image
                                width={320}
                                height={225}
                                className="h-48 w-full object-cover md:h-full md:w-80"
                                src={
                                    "https://blogsadmin.nivarana.org/images/" +
                                    upload_image
                                }
                                alt=""
                                priority={aboveTheFold}
                            />
                        </Link>
                    </div>

                    <div className="p-8">
                        {/* <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{categro}</div> */}
                        <Link href={"/article/" + path}>
                            <div className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                                {page_title}
                            </div>
                            <p className="mt-2 text-slate-500">
                                {meta_description}
                            </p>
                        </Link>
                        <ul className="flex space-x-4 text-gray-500 text-sm mt-3 items-center">
                            <NAuthors
                                authors_data={authors ?? authors_data}
                                author={author}
                            />
                            <li>{moment(created_at).format("MMM DD, YYYY")}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArticlePreview;
