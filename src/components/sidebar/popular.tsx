import { getPopularPosts } from "@/data/cms";
import { getImageURLFromFileName } from "@/utils/paths";
import Image from "next/image";
import Link from "next/link";

const PopularPosts = async () => {
    const posts = await getPopularPosts();
    if (posts.length === 0) return;
    return (
        <div className="widget rounded">
            <div className="widget-header text-center">
                <h3 className="widget-title">Popular Posts</h3>
                <Image
                    width={50}
                    height={20}
                    src="/assets/wave.svg"
                    className="wave"
                    alt="wave"
                />
            </div>
            <div className="widget-content">
                {posts.slice(0, 5).map((values, index) => {
                    return (
                        <div className="post post-list-sm circle" key={index}>
                            <div className="thumb circle">
                                <Link href={"/article/" + values.path}>
                                    <div className="inner">
                                        <Image
                                            src={getImageURLFromFileName(
                                                values.upload_image,
                                            )}
                                            alt="post-title"
                                            height={60}
                                            width={60}
                                            style={{
                                                height: "60px",
                                                width: "60px",
                                            }}
                                        />
                                    </div>
                                </Link>
                            </div>
                            <div className="details clearfix">
                                <Link href={"/article/" + values.path}>
                                    <h6 className="post-title my-0 text-black">
                                        {values.page_title}
                                    </h6>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PopularPosts;
