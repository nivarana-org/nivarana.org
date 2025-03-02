import LanguageSpecificHome from "@/components/home/LanguageSpecific";
import RandomQuote from "@/components/sprinkle/random-quote";
import { getPageByPath } from "@/data/cms";
import { Metadata } from "next";
import { cache } from "react";

type Props = {
    params: Promise<{ slug: string }>;
};

const cachedGetPageBySlug = cache((slug: string) => {
    return getPageByPath(slug);
});

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    if (params.slug === "hindi" || params.slug === "हिन्दी") {
        return {
            title: "हिन्दी",
        };
    }
    const post = await cachedGetPageBySlug(params.slug);
    if (!post) return {};
    return {
        title: post.page_title,
    };
}

export default async function Page(props: Props) {
    const params = await props.params;
    if (params.slug === "hindi" || params.slug === "हिन्दी") {
        return <LanguageSpecificHome></LanguageSpecificHome>;
    }
    const page = await cachedGetPageBySlug(params.slug);
    if (!page) {
        return <RandomQuote />;
    }
    return (
        <div className="max-w-prose mx-auto p-5">
            <h1 className="font-4xl">{page.page_title}</h1>
            <p dangerouslySetInnerHTML={{ __html: page.description }}></p>
        </div>
    );
}
