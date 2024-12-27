import { Article, getArticlesOverview } from "@/data/cms";
import Link from "next/link";

import Table from "@mui/joy/Table";
import { Box, Button } from "@mui/joy";
import Image from "next/image";

function ArticleRow({
    id,
    page_title,
    path,
    upload_image,
    total_views,
}: Article) {
    const adminLink = `/admin/articles/${id}`;
    const publicLink = `/article/${path}`;
    return (
        <>
            <td>
                <Image
                    src={`/uploads/${upload_image}`}
                    alt=""
                    height={55}
                    width={80}
                ></Image>
            </td>
            <td>
                <Link href={adminLink}>{page_title}</Link>
            </td>
            <td>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Link href={adminLink}>
                        <Button>Edit</Button>
                    </Link>
                    <Link href={publicLink}>
                        <Button>Open</Button>
                    </Link>
                </Box>
            </td>
            <td>{total_views}</td>
        </>
    );
}

export default async function Page({}) {
    const articles = await getArticlesOverview();
    const nextCount = Number(articles[0].id) + 1;
    return (
        <div className="flex flex-col gap-2 p-2">
            <div className="p-2 flex flex-row gap-2">
                <Link href="/admin/articles/bulk-edit/">
                    <Button>Bulk Edit</Button>
                </Link>
                <Link href={`/admin/articles/${nextCount}`}>
                    <Button>New Article</Button>
                </Link>
            </div>
            <Table sx={{ "& thead th:nth-child(1)": { width: "100px" } }}>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Actions</th>
                        <th>Views</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.map((a) => (
                        <tr key={a.id}>
                            <ArticleRow {...a} />
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
