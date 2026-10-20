import Link from "next/link";

import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import Image from "next/image";
import { getImageURLFromFileName } from "@/utils/paths";
import { getArticlesOverview, type Article } from "./queries";

function ArticleRow({
    id,
    page_title,
    path,
    upload_image,
    total_views,
    type,
}: Article) {
    const adminLink = `/admin/articles/${id}`;
    const publicLink = `/${type}/${path}`;
    return (
        <TableRow>
            <TableCell>
                <Image
                    src={getImageURLFromFileName(upload_image)}
                    alt=""
                    height={55}
                    width={80}
                ></Image>
            </TableCell>
            <TableCell>
                <Link href={adminLink}>{page_title}</Link>
            </TableCell>
            <TableCell>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Link href={adminLink}>
                        <Button>Edit</Button>
                    </Link>
                    <Link href={publicLink}>
                        <Button>Open</Button>
                    </Link>
                </Box>
            </TableCell>
            <TableCell>{total_views}</TableCell>
        </TableRow>
    );
}

export default async function Page({}) {
    const articles = await getArticlesOverview();
    const nextCount = Number(articles[0].id) + 1;
    return (
        <div className="flex flex-col gap-2 p-2">
            <div className="p-2 flex flex-row gap-2">
                <Link href={`/admin/articles/${nextCount}`}>
                    <Button>New Article</Button>
                </Link>
                <Link href={`/admin/articles/${nextCount}?type=photo-essay`}>
                    <Button>New Photo Essay</Button>
                </Link>
            </div>
            <Table sx={{ "& thead th:nth-child(1)": { width: "100px" } }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Actions</TableCell>
                        <TableCell>Views</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {articles.map((a) => (
                        <ArticleRow key={a.id} {...a} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
