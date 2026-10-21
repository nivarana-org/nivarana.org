import Link from "next/link";

import ArticlePreview from "@/app/(public)/_components/article/ArticlePreview";

import Search from "./_components/search";
import {
    EMPTY_SUGGESTIONS,
    getSearchSuggestions,
    searchArticles,
} from "./queries";

import type { SuggestionLink } from "./queries";

type Props = {
    searchParams?: Promise<{
        q?: string;
    }>;
};

type ArticleResults = Awaited<ReturnType<typeof searchArticles>>;

const Results = ({
    results,
    hasEntityMatches,
}: {
    results: ArticleResults;
    hasEntityMatches: boolean;
}) => {
    if (results.length === 0)
        return (
            <div className="max-w-64 mx-auto">
                {hasEntityMatches
                    ? "No articles matched your search"
                    : "Your search produced no results"}
            </div>
        );
    return (
        <>
            {results.map((a) => (
                <ArticlePreview {...a} key={a.slug} category={a.category} />
            ))}
        </>
    );
};

const EntityMatches = ({
    title,
    items,
}: {
    title: string;
    items: SuggestionLink[];
}) => {
    if (items.length === 0) return null;
    return (
        <section className="mb-6 max-w-64 mx-auto">
            <h2 className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                {title}
            </h2>
            <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default async function SearchPage(props: Props) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q;
    const results = q ? await searchArticles(q) : [];
    const suggestions = q ? await getSearchSuggestions(q) : EMPTY_SUGGESTIONS;
    const hasEntityMatches =
        suggestions.authors.length > 0 ||
        suggestions.categories.length > 0 ||
        suggestions.tags.length > 0;
    return (
        <div className="p-2">
            <h1 className="text-bold text-3xl text-center">Search</h1>
            <div className="max-w-64 mx-auto mb-4">
                <Search placeholder="enter text to search" />
            </div>
            {q && (
                <>
                    <EntityMatches
                        title="Authors"
                        items={suggestions.authors}
                    />
                    <EntityMatches
                        title="Categories"
                        items={suggestions.categories}
                    />
                    <EntityMatches title="Tags" items={suggestions.tags} />
                    <Results
                        results={results}
                        hasEntityMatches={hasEntityMatches}
                    />
                </>
            )}
        </div>
    );
}
