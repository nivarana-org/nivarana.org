import ArticlePreview from "@/app/(public)/_components/article/ArticlePreview";
import { getTagBySlug } from "./queries";
import { getRedirect } from "./queries";
import { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

const cachedGetTagBySlug = cache((slug: string) => {
    return getTagBySlug(slug);
});

async function Page(props: Props) {
    const params = await props.params;
    const slug = params.slug;
    const tag = await cachedGetTagBySlug(slug);
    if (!tag) {
        const result = await getRedirect(`/tag/${slug}`);
        if (result && result.destination) {
            redirect(result.destination);
        } else {
            notFound();
        }
    }
    return (
        <div className="max-w-(--breakpoint-xl) mx-auto mt-4">
            <div className="uppercase text-black mb-8 font-bold text-4xl mx-auto p-4">
                {tag.name}
            </div>

            {tag.articles.map((item) => (
                <ArticlePreview
                    {...item}
                    key={item.slug}
                    category={item.category}
                />
            ))}
        </div>
    );
}

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata(
    props: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const params = await props.params;
    const slug = params.slug;
    const tag = await cachedGetTagBySlug(slug);
    return {
        title: tag?.name ?? "Tag",
        description: (await parent).description,
        keywords: ["tag"],
    };
}

export default Page;
