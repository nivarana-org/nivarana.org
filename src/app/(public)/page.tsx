import ArticlePreview from "@/components/article/ArticlePreview";
import LoadMore from "@/components/home/LoadMore";
import Sidebar from "@/components/sidebar";
import { getPostsOfPage } from "@/network/api";

export default async function Home() {
  const initialPosts = await getPostsOfPage("0");
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2">
          {initialPosts.map((item, index) => (
            <ArticlePreview {...item} key={item.path} aboveTheFold={index < 2} />
          ))}
          <LoadMore></LoadMore>
        </div>
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>)
}
