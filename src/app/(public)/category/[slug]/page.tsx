import ArticlePreview from "@/components/article/ArticlePreview";
import Sidebar from "@/components/sidebar";
import { getCategoryByPath } from "@/data/cms";
import { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";

const cachedGetCategroyBySlug = cache((path: string) => {
    return getCategoryByPath(path);
});

async function Page(props: Props) {
    const params = await props.params;
    const slug = params.slug;
    const category = await cachedGetCategroyBySlug(slug);
    return (
        <div className="max-w-(--breakpoint-xl) mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                <div className="lg:col-span-2">
                    <div className="text-center text-black mb-8">
                        <div className="font-bold text-4xl mx-auto">
                            {category.name}
                        </div>
                    </div>
                    {category.articles.map((item) => (
                        <ArticlePreview {...item} key={item.path} />
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <Sidebar />
                </div>
            </div>
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
    const category = await cachedGetCategroyBySlug(slug);
    return {
        title: category.name,
        description: category.meta_description ?? (await parent).description,
        keywords: category.meta_keyword ?? (await parent).keywords,
    };
}

export default Page;
