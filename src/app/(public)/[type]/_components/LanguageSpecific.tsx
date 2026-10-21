import ArticlePreview from "@/app/(public)/_components/article/ArticlePreview";
import Sidebar from "@/app/(public)/_components/sidebar";
import { getArticlesFilteredAndPaginated } from "../queries";

export default async function LanguageSpecificHome() {
    const initialPosts = await getArticlesFilteredAndPaginated(0, 100, "hi");
    return (
        <div className="max-w-(--breakpoint-xl) mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                <div className="lg:col-span-2">
                    {initialPosts.map((item, index) => (
                        <ArticlePreview
                            {...item}
                            key={item.slug}
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
