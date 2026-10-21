import moment from "moment";
import Image from "next/image";
import Link from "next/link";

import { getArticleSlug, getImageURLFromFileName } from "@/utils/paths";

import { NAuthors } from "../authors/Authors";

import type { ArticleAuthor } from "../authors/Authors";

/**
 * The category an article is filed under. It is also the first segment of the
 * article URL, so a preview needs it to build a working link.
 */
type ArticleCategory = {
    name: string;
    slug: string;
};

export type ArticlePreviewProps = {
    slug: string | null;
    title: string | null;
    intro: string | null;
    image: string | null;
    created_at: Date | number | string;
    authors: ArticleAuthor[];
    category?: ArticleCategory;
    /** Preload the cover image, for previews that are visible without scrolling. */
    aboveTheFold?: boolean;
    /** Show the category of the article next to the preview. */
    includeCategory?: boolean;
};

function ArticlePreview({
    slug,
    authors,
    image,
    title,
    intro,
    created_at,
    category,
    aboveTheFold = false,
    includeCategory = false,
}: ArticlePreviewProps) {
    const href = getArticleSlug({ slug: slug ?? "", category });

    return (
        <div className="flex flex-wrap">
            {includeCategory && category ? (
                <div className="p-3 grow-0 w-30">
                    <Link
                        href={`/category/${category.slug}`}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        {category.name}
                    </Link>
                </div>
            ) : null}
            <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden md:max-w-4xl mb-3 grow shrink-0 hover:drop-shadow-xl">
                <div className="md:flex">
                    <div className="md:shrink-0">
                        {image ? (
                            <Link href={href}>
                                <Image
                                    width={320}
                                    height={225}
                                    className="h-48 w-full object-cover md:h-full md:w-80"
                                    src={getImageURLFromFileName(image)}
                                    alt={title ?? ""}
                                    preload={aboveTheFold}
                                />
                            </Link>
                        ) : (
                            <div className="h-48 w-full bg-gray-200 md:h-full md:w-80" />
                        )}
                    </div>

                    <div className="p-8">
                        <Link href={href}>
                            <div className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                                {title}
                            </div>
                            <p className="mt-2 text-slate-500">{intro}</p>
                        </Link>
                        <ul className="flex space-x-4 text-gray-500 text-sm mt-3 items-center">
                            <NAuthors authors={authors} />
                            <li>{moment(created_at).format("MMM DD, YYYY")}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArticlePreview;
