import { getArticlesOverview } from "@/data/cms"
import Link from "next/link";

export default async function Page({ }) {
    const articles = await getArticlesOverview();
    return <div className="flex flex-col gap-2 p-2">
        {articles.map(a => <Link href={`/admin/articles/${a.id}`}>
            {a.page_title}
        </Link>)}
    </div>
}