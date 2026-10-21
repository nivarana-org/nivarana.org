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

import { getPagesOverview } from "./queries";

type Page = {
    id: number;
    title: string;
    slug: string;
    contents: string;
};

function PageRow({ id, title, slug }: Page) {
    const adminLink = `/admin/pages/${id}`;
    const publicLink = `/${slug}`;
    return (
        <TableRow>
            <TableCell>
                <Link href={adminLink}>{title}</Link>
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
        </TableRow>
    );
}

export default async function Page({}) {
    const pages = await getPagesOverview();
    return (
        <div className="flex flex-col gap-2 p-2">
            <div className="p-2 flex flex-row gap-2"></div>
            <Table sx={{ "& thead th:nth-child(1)": { width: "100px" } }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pages.map((a) => (
                        <PageRow key={a.id} {...a} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
