import ArticlePreview from "@/components/article/ArticlePreview";
import Sidebar from "@/components/sidebar";
import { getCategoryByPath, getRedirect } from "@/data/cms";
import { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

const cachedGetCategoryBySlug = cache((path: string) => {
    return getCategoryByPath(path);
});

async function Page(props: Props) {
    const params = await props.params;
    const slug = params.slug;
    const category = await cachedGetCategoryBySlug(slug);
    if (!category) {
        const { destination } = await getRedirect(`/category/${slug}`);
        if (destination) {
            redirect(destination);
        } else {
            notFound();
        }
    }
    return (
        <div className="max-w-(--breakpoint-xl) mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                <div className="lg:col-span-2">
                    <div className="uppercase text-black mb-8 font-bold text-4xl mx-auto">
                        {category.name}
                    </div>
                    <div
                        className="mx-auto mb-8 border-b-2"
                        dangerouslySetInnerHTML={{
                            __html: category.meta_description,
                        }}
                    ></div>

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
    const category = await cachedGetCategoryBySlug(slug);
    return {
        title: category.name,
        description: category.meta_description ?? (await parent).description,
        keywords: category.meta_keyword ?? (await parent).keywords,
    };
}

export default Page;
