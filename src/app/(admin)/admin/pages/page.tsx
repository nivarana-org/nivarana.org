import Link from "next/link";

import Table from "@mui/joy/Table";
import { Box, Button } from "@mui/joy";
import { getPagesOverview } from "@/data/cms";

type Page = {
    id: number;
    page_title: string;
    page_name: string;
    description: string;
};

function PageRow({ id, page_title, page_name }: Page) {
    const adminLink = `/admin/pages/${id}`;
    const publicLink = `/${page_name}`;
    return (
        <>
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
        </>
    );
}

export default async function Page({}) {
    const pages = await getPagesOverview();
    return (
        <div className="flex flex-col gap-2 p-2">
            <div className="p-2 flex flex-row gap-2"></div>
            <Table sx={{ "& thead th:nth-child(1)": { width: "100px" } }}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pages.map((a) => (
                        <tr key={a.id}>
                            <PageRow {...a} />
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
