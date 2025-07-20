import ArticlePreview from "@/components/article/ArticlePreview";
import { getAuthorByPath, getRedirect } from "@/data/cms";
import { normalizeAsOldSlugs } from "@/utils/normalizers";
import { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

const cachedGetAuthorBySlug = cache((slug: string) => {
    const path = normalizeAsOldSlugs(slug);
    return getAuthorByPath(path);
});

async function Page(props: Props) {
    const params = await props.params;
    const slug = params.slug;
    const author = await cachedGetAuthorBySlug(slug);
    if (!author) {
        const { destination } = await getRedirect(`/author/${slug}`);
        if (destination) {
            redirect(destination);
        } else {
            notFound();
        }
    }
    return (
        <div className="max-w-(--breakpoint-xl) mx-auto">
            <AuthorDetails data={author} />
            <hr className="mb-3" />
            {author.articles.map((item) => (
                <ArticlePreview
                    {...item}
                    category={item.categories}
                    key={item.path}
                    includeCategory={true}
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
    const data = await cachedGetAuthorBySlug(slug);
    return {
        title: data.name,
        description: data?.description ?? (await parent).description,
        keywords: ["author"],
    };
}

async function AuthorDetails({ data }) {
    return (
        <div className="mr-auto p-4 mb-10">
            <h4 className="name mb-0 text-6xl mb-12">{data.name}</h4>
            {data.title != null && (
                <p
                    className="mt-2 max-w-prose"
                    dangerouslySetInnerHTML={{
                        __html: data.title,
                    }}
                />
            )}
            {data.description != null && (
                <p
                    className="mt-2 max-w-prose text-black"
                    dangerouslySetInnerHTML={{
                        __html: data.description,
                    }}
                />
            )}
        </div>
    );
}

export default Page;
