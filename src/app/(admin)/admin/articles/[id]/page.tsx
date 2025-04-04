import ArticleEditPage from "@/components/admin/ArticleEditPage";
import {
    getAllAuthors,
    getAllCategories,
    getAllTags,
    getArticleFullWithRelations,
} from "@/data/cms";

export default async function Page(props: Props) {
    const params = await props.params;
    const postId = Number(params.id);
    const [rowPost, rowAllAuthors, rowAllCategories, rowAllTags] =
        await Promise.all([
            getArticleFullWithRelations(postId),
            getAllAuthors(),
            getAllCategories(),
            getAllTags(),
        ]);
    const post = rowPost
        ? JSON.parse(JSON.stringify(rowPost))
        : {
              page_title: "",
              description: "",
              id: postId,
              upload_image: "logo.png",
              status: "DRAFT",
          };
    const allAuthors = rowAllAuthors.map((a) => ({ ...a }));
    const allCategories = rowAllCategories.map((c) => ({ ...c }));
    const allTags = rowAllTags.map((t) => ({ ...t }));
    return (
        <ArticleEditPage
            post={post}
            allAuthors={allAuthors}
            allCategories={allCategories}
            allTags={allTags}
        />
    );
}

type Props = {
    params: Promise<{ id: string }>;
};
