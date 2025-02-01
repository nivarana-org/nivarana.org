import AuthorEditPage from "@/components/admin/AuthorEditPage";
import { getAuthor } from "@/data/cms";

export default async function Page(props: Props) {
    const params = await props.params;
    const authorId = Number(params.id);
    const rawAuthor = await getAuthor(authorId)
    const author = rawAuthor
        ? { ...rawAuthor }
        : {
              name: "",
              description: "",
              id: authorId,
              image: "logo.png",
          };
    return (
        <AuthorEditPage
            author={author}
        />
    );
}

type Props = {
    params: Promise<{ id: string }>;
};
