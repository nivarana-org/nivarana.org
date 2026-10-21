import { getPublishedPostPreviews } from "./queries";
import { getImageURLFromFileName } from "@/utils/paths";
import { ArticleCard } from "./_components/ArticleCard";

export default async function BrowsePage() {
    const articles = await getPublishedPostPreviews();

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {articles.map((article) => (
                    <ArticleCard
                        key={article.id}
                        id={article.id}
                        slug={article.slug}
                        title={article.title}
                        category={article.categories?.[0]?.slug ?? ""}
                        imageUrl={getImageURLFromFileName(article.image)}
                    />
                ))}
            </div>
        </div>
    );
}
