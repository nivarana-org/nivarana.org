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
import { getAuthorsOverview, type Author } from "./queries";

function AuthorRow({ id, name, path }: Author) {
    const adminLink = `/admin/people/${id}`;
    const publicLink = `/author/${path}`;
    return (
        <TableRow>
            <TableCell>
                <Link href={adminLink}>{name}</Link>
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
    const authors = await getAuthorsOverview();
    const nextCount = Number(authors[0].id) + 1;
    return (
        <div className="flex flex-col gap-2 p-2">
            <div className="p-2 flex flex-row gap-2">
                <Link href={`/admin/people/${nextCount}`}>
                    <Button>New Author</Button>
                </Link>
            </div>
            <Table sx={{ "& thead th:nth-child(1)": { width: "100px" } }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {authors.map((a) => (
                        <AuthorRow key={a.id} {...a} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
