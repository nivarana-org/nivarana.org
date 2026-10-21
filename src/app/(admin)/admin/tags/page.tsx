import { getAllArticlesAndTags } from "./queries";
import { getAllTags } from "./queries";
import Link from "next/link";
import Selector from "./_components/Selector";
import { Button } from "@mui/material";
import { editPostTags } from "./queries";

import type { Category, Tag } from "./queries";

async function onTagChange(post: number, tags: number[]) {
    "use server";
    return await editPostTags(post, tags);
}

function ArticleRow({
    id,
    title,
    slug,
    tags,
    allTags,
    category,
}: {
    id: number;
    title: string | null;
    slug: string | null;
    tags: Tag[];
    allTags: Tag[];
    category: Category;
}) {
    // The public URL of a post is prefixed with the slug of its category.
    const type = category.slug;
    return (
        <div className="mb-4">
            <div>
                {title}{" "}
                {type && slug ? (
                    <Button>
                        <Link href={`/${type}/${slug}`}>📎</Link>
                    </Button>
                ) : null}
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
    const nextTag = Number(tags.at(-1)?.id ?? 0) + 1;

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
