import Article from "@/components/article"
import Breadcrumbs from "@/components/article/Breadcrumbs"
import Sidebar from "@/components/sidebar"
import { getPost, incrementBlogViewCount } from "@/network/api"
import { notFound } from "next/navigation"

export default async function Page({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);
    incrementBlogViewCount(params.slug);
    if (!post) {
        notFound()
    }
    return (
        <div className="max-w-screen-xl mx-auto">
            <Breadcrumbs category={post.category} page_title={post.page_title} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                <div className="lg:col-span-2">
                    <Article data={post} />
                </div>
                <div className="lg:col-span-1">
                    <Sidebar />
                </div>
            </div>
        </div>)
}