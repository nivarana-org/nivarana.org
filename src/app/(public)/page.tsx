import ArticlePreview from "@/components/article/ArticlePreview";
import LoadMore from "@/components/home/LoadMore";
import Sidebar from "@/components/sidebar";
import { getArticlesPaginated } from "@/data/cms";
import Link from "next/link";

export default async function Home() {
    const initialPosts = await getArticlesPaginated(0);
    return (
        <div className="max-w-(--breakpoint-xl) mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                <div className="lg:col-span-2">
                    <div className="flex justify-center mt-4">
                        <Link
                            href="/hindi"
                            className="px-4 py-2 bg-blue-500 text-white rounded-sm"
                        >
                            हिंदी
                        </Link>
                    </div>
                    {initialPosts.map((item, index) => (
                        <ArticlePreview
                            {...item}
                            key={item.path}
                            aboveTheFold={index < 2}
                        />
                    ))}
                    <LoadMore></LoadMore>
                </div>
                <div className="lg:col-span-1">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}
