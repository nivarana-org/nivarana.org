import Link from "next/link";

import { Box, Button } from "@mui/material";
import Selector from "./_components/selector";
import { editPostCategory } from "./queries";
import { getCategoriesWithArticleLinks } from "./queries";

// Selector is a client component, so it can only receive server actions.
async function setPostToCategory(postId: number, categoryId: number) {
    "use server";
    return await editPostCategory(postId, categoryId);
}

function CategoryRow({ id, name, slug, articles, categories }) {
    const publicLink = `/category/${slug}`;
    return (
        <div className="mb-4">
            <h1>{name}</h1>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Link href={publicLink}>
                    <Button>Open</Button>
                </Link>
            </Box>
            <div>{`${articles.length} articles`}</div>
            {articles.map((a) => (
                <div key={a.id}>
                    {a.title}{" "}
                    <Selector
                        categories={categories}
                        initialSelected={id}
                        postId={a.id}
                        setPostToCategory={setPostToCategory}
                    ></Selector>
                </div>
            ))}
            <hr />
        </div>
    );
}

export default async function Page({}) {
    const categories = await getCategoriesWithArticleLinks();
    const nextCount = Number(categories.at(-1).id) + 1;
    return (
        <div className="flex flex-col gap-2 p-2">
            <div className="p-2 flex flex-row gap-2">
                <Link href={`/admin/categories/${nextCount}`}>
                    <Button>New Category</Button>
                </Link>
            </div>
            {categories.map((a) => (
                <div key={a.id}>
                    <CategoryRow
                        {...a}
                        categories={categories.map(({ id, name }) => ({
                            id,
                            name,
                        }))}
                    />
                </div>
            ))}
        </div>
    );
}
