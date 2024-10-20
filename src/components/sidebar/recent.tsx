import { getLatestPosts} from "@/network/api"
import Link from "next/link";

const RecentPosts = async () => {
    const recentPostsResponse = await getLatestPosts();
    const posts = recentPostsResponse.data;
    if (posts.length === 0) return;
    return (
        <div className="widget rounded">
            <div className="widget-header text-center">
                <h3 className="widget-title">Popular Posts</h3>
                <img src="/images/wave.svg" className="wave" alt="wave" />
            </div>
            <div className="widget-content">
                {posts.slice(0, 5).map((values, index) => {
                    return (
                        <div className="post post-list-sm circle" key={index}>
                            <div className="thumb circle">
                                <Link href={'/article/' + values.path}>
                                    <div className="inner">
                                        <img
                                            src={"https://blogsadmin.nivarana.org/images/" + values.upload_image}
                                            alt="post-title"
                                            style={{
                                                height: '60px',
                                                width: '60px',
                                            }}
                                        />
                                    </div>
                                </Link>
                            </div>
                            <div className="details clearfix">
                                <Link href={'/article/' + values.path}>
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
    )
}

export default RecentPosts;