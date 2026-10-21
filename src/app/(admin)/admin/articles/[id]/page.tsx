import ArticleEditPage from "./_components/ArticleEditPage";
import { getAllAuthors } from "./queries";
import { getAllCategories } from "./queries";
import { getAllTags } from "./queries";
import { getArticleFullWithRelations } from "./queries";
import { deriveLayout, serializeStory } from "@/data/story";

const getEmptyPost = (postId: number) => {
    return {
        title: "",
        contents: serializeStory([{ title: "", body: "" }]),
        id: postId,
        image: "logo.png",
        status: "DRAFT",
        layout: deriveLayout(1),
    };
};

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
        : getEmptyPost(postId);
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
