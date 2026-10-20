import { getAllArticlesAndTags } from "./queries";
import { getAllTags } from "./queries";
import Link from "next/link";
import Selector from "./_components/Selector";
import { Button } from "@mui/material";
import { editPostTags } from "./queries";

async function onTagChange(post, tags) {
    "use server";
    return await editPostTags(post, tags);
}

function ArticleRow({ id, type, page_title, path, tags, allTags }) {
    return (
        <div className="mb-4">
            <div>
                {page_title}{" "}
                <Button>
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
                        <Button>
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
