import ArticleEditor from "@/components/admin/ArticleEditor";
import { getArticleFull } from "@/data/cms";

export default async function Page(props: Props) {
    const params = await props.params;
    const post = await getArticleFull(parseInt(params.id));
    return (
        <div>
            <div className="text-bold">{post?.page_title}</div>
            <ArticleEditor initialValue={post.description} />
        </div>
    )
}


type Props = {
    params: Promise<{ id: string }>
}
