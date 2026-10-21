import { getPopularPosts } from "@/data/posts";
import { getArticleSlug, getImageURLFromFileName } from "@/utils/paths";
import Image from "next/image";
import Link from "next/link";

const PopularPosts = async () => {
    const posts = await getPopularPosts();
    if (posts.length === 0) return;
    return (
        <div className="mt-12 border-t border-nivarana-green/30 px-4 pb-4 pt-6">
            <h3 className="mb-4 text-xl font-bold text-nivarana-green">
                Popular Posts
            </h3>
            <div className="flex flex-col">
                {posts.slice(0, 5).map(({ image, title, slug, category }) => {
                    return (
                        <Link
                            key={slug}
                            className="group flex items-start gap-4 border-b border-gray-200 py-4 last:border-b-0"
                            href={getArticleSlug({
                                category,
                                slug: slug!,
                            })}
                        >
                            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded">
                                <Image
                                    src={getImageURLFromFileName(image)}
                                    alt={title ?? "oops"}
                                    fill
                                    sizes="96px"
                                    className="object-cover transition-opacity duration-200 group-hover:opacity-80"
                                />
                            </div>
                            <div className="min-w-0">
                                <div className="mb-1 text-xs uppercase tracking-wide text-nivarana-green">
                                    {category?.name}
                                </div>
                                <h6 className="line-clamp-2 text-base leading-snug text-nivarana-charcoal transition-colors duration-200 group-hover:text-nivarana-green">
                                    {title}
                                </h6>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default PopularPosts;
