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
import { getArticlesOverview, type PostOverview } from "./queries";

function PostRow({
    id,
    title,
    slug,
    image,
    views,
    layout,
    category,
}: PostOverview) {
    const adminLink = `/admin/articles/${id}`;
    const publicLink = `/${category?.slug ?? ""}/${slug}`;
    return (
        <TableRow>
            <TableCell>
                <Image
                    src={getImageURLFromFileName(image)}
                    alt=""
                    height={55}
                    width={80}
                ></Image>
            </TableCell>
            <TableCell>
                <Link href={adminLink}>{title}</Link>
            </TableCell>
            <TableCell>
                {layout === "paged" ? "Photo essay" : "Article"}
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
            <TableCell>{views}</TableCell>
        </TableRow>
    );
}

export default async function Page({}) {
    const articles = await getArticlesOverview();
    const nextCount = Number(articles[0]?.id ?? 0) + 1;
    return (
        <div className="flex flex-col gap-2 p-2">
            <div className="p-2 flex flex-row gap-2">
                <Link href={`/admin/articles/${nextCount}`}>
                    <Button>New Story</Button>
                </Link>
            </div>
            <Table sx={{ "& thead th:nth-child(1)": { width: "100px" } }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Kind</TableCell>
                        <TableCell>Actions</TableCell>
                        <TableCell>Views</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {articles.map((a) => (
                        <PostRow key={a.id} {...a} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
