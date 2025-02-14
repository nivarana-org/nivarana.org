import ArticlePreview from "@/components/article/ArticlePreview";
import Search from "@/components/search/search";
import { searchArticles } from "@/data/cms";

type Props = {
    searchParams?: Promise<{
        q?: string;
    }>;
};

const Results = ({ results }) => {
    if (results.length === 0)
        return (
            <div className="max-w-64 mx-auto">
                Your search produced no results
            </div>
        );
    return (
        <>
            {results.map((a) => (
                <ArticlePreview {...a} key={a.path} />
            ))}
        </>
    );
};

export default async function SearchPage(props: Props) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q;
    const result = q ? await searchArticles(q) : [];
    return (
        <div className="p-2">
            <h1 className="text-bold text-3xl text-center">Search</h1>
            <div className="max-w-64 mx-auto mb-4">
                <Search placeholder="enter text to search" />
            </div>
            <Results results={result} />
        </div>
    );
}
