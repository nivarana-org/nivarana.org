import ArticlePreview from "@/components/article/ArticlePreview";
import Sidebar from "@/components/sidebar";
import { getArticlesFilteredAndPaginated } from "@/data/cms";

export default async function LanguageSpecificHome() {
    const initialPosts = await getArticlesFilteredAndPaginated(0, 100, "hi");
    return (
        <div className="max-w-(--breakpoint-xl) mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                <div className="lg:col-span-2">
                    {initialPosts.map((item, index) => (
                        <ArticlePreview
                            {...item}
                            key={item.path}
                            aboveTheFold={index < 2}
                        />
                    ))}
                </div>
                <div className="lg:col-span-1">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}
