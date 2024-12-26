import ArticleEditPage from "@/components/admin/ArticleEditPage";
import { getAllAuthors, getArticleFull } from "@/data/cms";

export default async function Page(props: Props) {
    const params = await props.params;
    const postId = Number(params.id);
    const [rowPost, rowAllAuthors] = await Promise.all([
        getArticleFull(postId),
        getAllAuthors(),
    ]);
    const post = rowPost
        ? { ...rowPost }
        : {
              page_title: "",
              description: "",
              id: postId,
          };
    const allAuthors = rowAllAuthors.map((a) => ({ ...a }));
    return <ArticleEditPage post={post} allAuthors={allAuthors} />;
}

type Props = {
    params: Promise<{ id: string }>;
};
