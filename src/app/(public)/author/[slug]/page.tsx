import ArticlePreview from "@/components/article/ArticlePreview";
import { getAuthorByPath } from "@/data/cms";
import { normalizeAsOldSlugs } from "@/utils/normalizers";
import { getImageURLFromFileName } from "@/utils/paths";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { cache } from "react";

const cachedGetAuthorBySlug = cache((slug: string) => {
    const path = normalizeAsOldSlugs(slug);
    return getAuthorByPath(path);
});

async function Page(props: Props) {
    const params = await props.params;
    const slug = params.slug;
    const author = await cachedGetAuthorBySlug(slug);
    return (
        <div className="max-w-screen-xl mx-auto">
            <AuthorDetails data={author} />
            <hr className="mb-3" />
            {author.articles.map((item) => (
                <ArticlePreview
                    {...item}
                    category={item.categories[0]}
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

function AuthorPic({ image }) {
    if (image === null) return;
    return (
        <div className="">
            <Image
                src={getImageURLFromFileName(image)}
                className="author"
                alt="author"
                height={400}
                width={200}
            />
        </div>
    );
}

async function AuthorDetails({ data }) {
    return (
        <div className="mr-auto p-4 mb-40">
            <AuthorPic image={data.image} />
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
