import AuthorEditPage from "./_components/AuthorEditPage";
import { getAuthor } from "@/data/authors";

export default async function Page(props: Props) {
    const params = await props.params;
    const authorId = Number(params.id);
    const rawAuthor = await getAuthor(authorId);
    const author = rawAuthor
        ? { ...rawAuthor }
        : {
              name: "",
              description: "",
              id: authorId,
              image: "author.png",
          };
    return <AuthorEditPage author={author} />;
}

type Props = {
    params: Promise<{ id: string }>;
};
