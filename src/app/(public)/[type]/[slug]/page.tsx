import Article from "@/components/article";
import PhotoEssay from "@/components/photo-essay";
import Sidebar from "@/components/sidebar";
import { getArticleByPath, getRedirect } from "@/data/cms";
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
    const requestedCategory = params.type;
    const post = await cachedGetArticleBySlug(params.slug);
    if (!post) {
        const paths = [params.slug, normalizeAsOldSlugs(params.slug)];
        for (const path of paths) {
            const result = await getRedirect(path);
            if (result && result.destination) {
                return redirect(result.destination);
            }
        }

        return notFound();
    }
    const actualCategory = post.category[0].path;
    if (actualCategory !== requestedCategory) {
        redirect(`/${actualCategory}/${params.slug}`);
    }
    if (post.type === "article")
        return (
            <div>
                <Article data={post} />
                <div className="lg:col-span-1">
                    <Sidebar />
                </div>
            </div>
        );
    if (post.type === "photo-essay")
        return (
            <div className="max-w-(--breakpoint-xl) mx-auto">
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
