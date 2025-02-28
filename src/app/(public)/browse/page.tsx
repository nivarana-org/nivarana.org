import { getArticlesOverview } from "@/data/cms";
import { getImageURLFromFileName } from "@/utils/paths";
import { ArticleCard } from "@/components/browse/ArticleCard";

export default async function BrowsePage() {
    const articles = await getArticlesOverview();

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {articles.map((article) => (
                    <ArticleCard
                        key={article.id}
                        id={article.id}
                        path={article.path}
                        title={article.page_title}
                        imageUrl={getImageURLFromFileName(article.upload_image)}
                    />
                ))}
            </div>
        </div>
    );
}
