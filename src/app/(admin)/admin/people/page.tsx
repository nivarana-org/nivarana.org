import Link from "next/link";

import Table from "@mui/joy/Table";
import { Box, Button } from "@mui/joy";
import { Author, getAuthorsOverview } from "@/data/cms";

function AuthorRow({
    id,
    name,
    path
}: Author) {
    const adminLink = `/admin/people/${id}`;
    const publicLink = `/author/${path}`;
    return (
        <>
            <td>
                <Link href={adminLink}>{name}</Link>
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
        </>
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
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {authors.map((a) => (
                        <tr key={a.id}>
                            <AuthorRow {...a} />
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
