import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import { NAuthors } from '../authors/Authors';

function ArticlePreview({
    path, authors_data, author, upload_image, page_title, meta_description, created_at, category
}) {
    return (
        <>
            <Link href={'/article/' + path}>
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl mb-3">
                    <div className="md:flex">
                        <div className="md:shrink-0">
                            <img className="h-48 w-full object-cover md:h-full md:w-80" src={"https://blogsadmin.nivarana.org/images/" + upload_image} />
                        </div>
                        <div className="p-8">
                            {/* <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{categro}</div> */}
                            <div className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{page_title}</div>
                            <p className="mt-2 text-slate-500">{meta_description}</p>
                            <ul className="flex space-x-4 text-gray-500 text-sm mt-3">
                                <NAuthors authors_data={authors_data} author={author} />
                                <li>
                                    {moment(created_at).format('MMM DD, YYYY')}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Link>
        </>

    );
}

export default ArticlePreview;
