import { editPostCategory, getCategoriesTable } from "@/data/cms";
import Link from "next/link";

import { Box, Button } from "@mui/joy";
import Selector from "./selector";

function CategoryRow({ id, name, path, articles, categories }) {
    const publicLink = `/category/${path}`;
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
                    {a.page_title}{" "}
                    <Selector
                        categories={categories}
                        initialSelected={id}
                        postId={a.id}
                        setPostToCategory={editPostCategory}
                    ></Selector>
                </div>
            ))}
            <hr />
        </div>
    );
}

export default async function Page({}) {
    const categories = await getCategoriesTable();
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
