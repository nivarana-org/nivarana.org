import { getPopularPosts } from "@/data/cms";
import { getArticleSlug, getImageURLFromFileName } from "@/utils/paths";
import Image from "next/image";
import Link from "next/link";

const PopularPosts = async () => {
    const posts = await getPopularPosts();
    if (posts.length === 0) return;
    return (
        <div className="mt-8 p-4 border-t border-nivarana-green">
            <h3 className="text-xl font-bold text-nivarana-green mb-6 border-b border-nivarana-green pb-2">
                Popular Posts
            </h3>
            <div className="flex flex-col">
                {posts
                    .slice(0, 5)
                    .map(
                        ({
                            upload_image,
                            page_title,
                            path,
                            type,
                            category,
                        }) => {
                            return (
                                <Link
                                    key={path}
                                    className="flex items-start py-4 border-b border-nivarana-green last:border-b-0 group"
                                    href={getArticleSlug({
                                        category: category[0],
                                        path,
                                        type,
                                    })}
                                >
                                    <div className="flex-shrink-0 mr-4">
                                        <Image
                                            src={getImageURLFromFileName(
                                                upload_image,
                                            )}
                                            alt={page_title}
                                            height={60}
                                            width={100}
                                            className="object-cover rounded group-hover:opacity-80 transition-opacity duration-200"
                                        />
                                    </div>
                                    <h6 className="text-lg text-nivarana-charcoal leading-tight transition-colors duration-200">
                                        {page_title}
                                    </h6>
                                </Link>
                            );
                        },
                    )}
            </div>
        </div>
    );
};

export default PopularPosts;
