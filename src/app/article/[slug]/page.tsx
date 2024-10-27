import Article from "@/components/article"
import Breadcrumbs from "@/components/article/Breadcrumbs"
import Sidebar from "@/components/sidebar"
import { getPost, incrementBlogViewCount } from "@/network/api"
import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

export default async function Page({ params }: Props) {
    const post = await getPost(params.slug);
    if (!post) {
        notFound()
    }
    return (
        <div className="max-w-screen-xl mx-auto">
            <Breadcrumbs category={post.category} page_title={post.page_title} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                <div className="lg:col-span-2">
                    <Article data={post} slug={params.slug} />
                </div>
                <div className="lg:col-span-1">
                    <Sidebar />
                </div>
            </div>
        </div>)
}


type Props = {
    params: { slug: string }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const post = await getPost(params.slug);
    return {
        title: post.page_title,
        description: post.meta_description ?? (await parent).description,
        keywords: post.meta_keyword ?? (await parent).keywords,
        openGraph: {
            images: [post.upload_image]
        }
    }
}
