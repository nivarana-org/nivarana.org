import ArticleEditPage from "@/components/admin/ArticleEditPage";
import {
    getAllAuthors,
    getAllCategories,
    getAllTags,
    getArticleFullWithRelations,
} from "@/data/cms";

type PostType = "article" | "photo-essay";

const getEmptyDescription = (type: PostType) => {
    switch (type) {
        case "article":
            return "";
        case "photo-essay":
            return JSON.stringify({ chapters: [{ title: "", body: "" }] });
    }
};

const getEmptyPost = (postId: number, postType: PostType) => {
    return {
        page_title: "",
        description: getEmptyDescription(postType),
        id: postId,
        upload_image: "logo.png",
        status: "DRAFT",
        type: postType ?? "article",
    };
};

export default async function Page(props: Props) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const postId = Number(params.id);
    const postType = searchParams.type;
    const [rowPost, rowAllAuthors, rowAllCategories, rowAllTags] =
        await Promise.all([
            getArticleFullWithRelations(postId),
            getAllAuthors(),
            getAllCategories(),
            getAllTags(),
        ]);
    const post = rowPost
        ? JSON.parse(JSON.stringify(rowPost))
        : getEmptyPost(postId, postType);
    const allAuthors = rowAllAuthors.map((a) => ({ ...a }));
    const allCategories = rowAllCategories.map((c) => ({ ...c }));
    const allTags = rowAllTags.map((t) => ({ ...t }));
    return (
        <ArticleEditPage
            post={post}
            allAuthors={allAuthors}
            allCategories={allCategories}
            allTags={allTags}
            type={post.type}
        />
    );
}

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ type: PostType }>;
};
