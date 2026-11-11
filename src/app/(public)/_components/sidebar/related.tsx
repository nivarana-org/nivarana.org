import { getRelatedPosts } from "@/data/posts";
import { getArticleSlug, getImageURLFromFileName } from "@/utils/paths";
import Image from "next/image";
import Link from "next/link";

type RelatedPostsProps = {
    tags: { id: number }[];
    excludePostId?: number;
};

const RelatedPosts = async ({ tags, excludePostId }: RelatedPostsProps) => {
    const posts = await getRelatedPosts(
        tags.map((tag) => tag.id),
        excludePostId,
    );
    if (posts.length === 0) return;
    return (
        <div className="mt-12 border-t border-nivarana-green/30 pb-4 pt-6">
            <h3 className="mb-4 text-xl font-bold text-nivarana-green">
                Related Posts
            </h3>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
                {posts.map(
                    ({ image, title, slug, category, intro, authors }) => {
                        return (
                            <Link
                                key={slug}
                                className="opacity-90 hover:opacity-100 md:flex md:flex-col"
                                href={getArticleSlug({
                                    category,
                                    slug: slug!,
                                })}
                            >
                                <div className="font-heading uppercase pb-2">
                                    {category?.name}
                                </div>
                                <div className="relative h-32 w-48 md:h-64 md:w-96 overflow-hidden">
                                    <Image
                                        src={getImageURLFromFileName(image)}
                                        alt={title ?? "oops"}
                                        fill
                                        sizes="192"
                                        className="object-cover transition-opacity duration-200 group-hover:opacity-80"
                                    />
                                </div>
                                <div className="mt-2">
                                    <h6 className="text-xl pb-2">{title}</h6>
                                    <p>
                                        Written by{" "}
                                        {authors.map((a) => a.name).join(", ")}
                                    </p>
                                    <p className="hidden md:block">{intro}</p>
                                </div>
                            </Link>
                        );
                    },
                )}
            </div>
        </div>
    );
};

export default RelatedPosts;
