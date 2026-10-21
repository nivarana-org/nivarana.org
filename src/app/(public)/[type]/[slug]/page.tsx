import Story from "./_components/story";
import { searchArticles } from "./queries";
import { getArticleBySlug } from "./queries";
import { getRedirect } from "./queries";
import { normalizeAsOldSlugs } from "@/utils/normalizers";
import { getImageURLFromFileName } from "@/utils/paths";
import moment from "moment";
import { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

const cachedGetArticleBySlug = cache((slug: string) => {
    const path = normalizeAsOldSlugs(slug);
    return getArticleBySlug(path);
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
        const searchResult = await searchArticles(params.slug);
        if (searchResult.length > 0) {
            const slug = searchResult[0].slug;
            const category = searchResult[0].category?.[0]?.slug;
            if (category) {
                return redirect(`/${category}/${slug}`, "replace");
            }
        }

        return notFound();
    }
    const actualCategory = post.categories[0]?.slug;
    if (actualCategory && actualCategory !== requestedCategory) {
        redirect(`/${actualCategory}/${params.slug}`);
    }
    return <Story data={post} chapter={searchParams.chapter ?? "0"} />;
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
    const imageUrl = getImageURLFromFileName(post.image);
    const optimizedImageUrl = `https://nivarana.org/_next/image?url=${encodeURIComponent(imageUrl)}&w=1200&q=75`;
    return {
        title: post.title,
        description: post.intro ?? (await parent).description,
        other: {
            citation_title: post.title,
            citation_date: moment(post.published_at).format("YYYY-MM-DD"),
            citation_journal_title: "Nivarana",
            citation_authors: post.authors.map((a) => a.name).join("; "),
            citation_author: post.authors.map((a) => a.name),
        },
        openGraph: {
            images: [optimizedImageUrl],
        },
    };
}
