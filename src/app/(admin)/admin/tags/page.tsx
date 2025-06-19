import { editPostTags, getAllArticlesAndTags, getAllTags } from "@/data/cms";
import Link from "next/link";
import Selector from "./Selector";
import { Button } from "@mui/joy";

async function onTagChange(post, tags) {
    "use server";
    return await editPostTags(post, tags);
}

function ArticleRow({ id, type, page_title, path, tags, allTags }) {
    return (
        <div className="mb-4">
            <div>
                {page_title}{" "}
                <Button variant="plain">
                    <Link href={`/${type}/${path}`}>📎</Link>
                </Button>
            </div>

            <Selector
                value={JSON.parse(JSON.stringify(tags))}
                allTags={allTags}
                onChange={async (newTags) => {
                    "use server";
                    return await onTagChange(id, newTags);
                }}
            ></Selector>
        </div>
    );
}

export default async function Page({}) {
    const articles = await getAllArticlesAndTags();
    const tags = await getAllTags();
    const nextTag = tags.at(-1).id + 1;

    return (
        <>
            <div className="flex flex-col gap-2 p-2">
                Tags available:
                <ul>
                    {tags.map((t) => (
                        <li key={t.id}>{t.name}</li>
                    ))}
                    <li>
                        <Button variant="plain">
                            <Link href={`/admin/tags/${nextTag}`}>
                                Create new
                            </Link>
                        </Button>
                    </li>
                </ul>
            </div>
            <div className="flex flex-col gap-2 p-2">
                {articles.reverse().map((a) => (
                    <ArticleRow key={a.id} {...a} allTags={tags}></ArticleRow>
                ))}
            </div>
        </>
    );
}
