import ArticleEditPage from "@/components/admin/ArticleEditPage";
import { getAllAuthors, getAllCategories, getArticleFull } from "@/data/cms";

export default async function Page(props: Props) {
    const params = await props.params;
    const postId = Number(params.id);
    const [rowPost, rowAllAuthors, rowAllCategories] = await Promise.all([
        getArticleFull(postId),
        getAllAuthors(),
        getAllCategories(),
    ]);
    const post = rowPost
        ? { ...rowPost }
        : {
              page_title: "",
              description: "",
              id: postId,
          };
    const allAuthors = rowAllAuthors.map((a) => ({ ...a }));
    const allCategories = rowAllCategories.map((c) => ({ ...c }));
    return (
        <ArticleEditPage
            post={post}
            allAuthors={allAuthors}
            allCategories={allCategories}
        />
    );
}

type Props = {
    params: Promise<{ id: string }>;
};
