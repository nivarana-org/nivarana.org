import Article from "@/components/article";
import Breadcrumbs from "@/components/article/Breadcrumbs";
import PhotoEssay from "@/components/photo-essay";
import Sidebar from "@/components/sidebar";
import { getArticleByPath } from "@/data/cms";
import { normalizeAsOldSlugs } from "@/utils/normalizers";
import { getImageURLFromFileName } from "@/utils/paths";
import { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

const cachedGetArticleBySlug = cache((slug: string) => {
    const path = normalizeAsOldSlugs(slug);
    return getArticleByPath(path);
});

export default async function Page(props: Props) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const postType = params.type;
    const post = await cachedGetArticleBySlug(params.slug);
    if (!post) {
        notFound();
    }
    if (post.type !== postType) {
        redirect(`/${post.type}/${params.slug}`);
    }
    if (postType === "article")
        return (
            <div className="max-w-screen-xl mx-auto">
                <Breadcrumbs
                    category={post.category[0]}
                    page_title={post.page_title}
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                    <div className="lg:col-span-2">
                        <Article data={post} />
                    </div>
                    <div className="lg:col-span-1">
                        <Sidebar />
                    </div>
                </div>
            </div>
        );
    if (postType === "photo-essay")
        return (
            <div className="max-w-screen-xl mx-auto">
                <div className="lg:col-span-2">
                    <PhotoEssay
                        data={post}
                        chapter={searchParams.chapter ?? "0"}
                    />
                </div>
            </div>
        );
}

type Props = {
    params: Promise<{ slug: string; type: string }>;
    searchParams: Promise<{ chapter: string }>;
};

export async function generateMetadata(
    props: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const params = await props.params;
    const post = await cachedGetArticleBySlug(params.slug);
    if (!post) return {};
    const imageUrl = getImageURLFromFileName(post.upload_image);
    const optimizedImageUrl = `https://nivarana.org/_next/image?url=${encodeURIComponent(imageUrl)}&w=1200&q=75`;
    return {
        title: post.page_title,
        description: post.meta_description ?? (await parent).description,
        keywords: post.meta_keyword ?? (await parent).keywords,
        openGraph: {
            images: [optimizedImageUrl],
        },
    };
}
