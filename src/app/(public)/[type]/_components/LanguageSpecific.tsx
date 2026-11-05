import ArticlePreview from "@/app/(public)/_components/article/ArticlePreview";
import { getArticlesFilteredAndPaginated } from "../queries";

export default async function LanguageSpecificHome() {
    const initialPosts = await getArticlesFilteredAndPaginated(0, 100, "hi");
    return (
        <div className="max-w-(--breakpoint-xl) mx-auto mt-4">
            {initialPosts.map((item, index) => (
                <ArticlePreview
                    {...item}
                    key={item.slug}
                    category={item.category}
                    aboveTheFold={index < 2}
                />
            ))}
        </div>
    );
}
