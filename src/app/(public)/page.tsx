import ArticlePreview from "@/components/article/ArticlePreview";
import LoadMore from "@/components/home/LoadMore";
import { getArticlesPaginated } from "@/data/cms";

export default async function Home() {
    const initialPosts = await getArticlesPaginated(0);
    return (
        <div className="max-w-(--breakpoint-xl) mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                {initialPosts.map((item, index) => (
                    <ArticlePreview
                        {...item}
                        key={item.path}
                        aboveTheFold={index < 2}
                    />
                ))}
                <LoadMore></LoadMore>
            </div>
        </div>
    );
}
