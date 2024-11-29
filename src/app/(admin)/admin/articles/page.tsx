import { Article, getArticlesOverview } from "@/data/cms"
import Link from "next/link";

import Table from "@mui/joy/Table"
import { Box, Button } from "@mui/joy";

function ArticleRow({ id, page_title, path }: Article) {
    const adminLink = `/admin/articles/${id}`
    const publicLink = `/article/${path}`
    return (
        <>
            <td>
                <Link href={adminLink}>
                    {page_title}
                </Link>
            </td>
            <td>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Link href={adminLink}><Button>Edit</Button></Link>
                    <Link href={publicLink}><Button>Open</Button></Link>
                </Box>
            </td>
        </>
    )
}

export default async function Page({ }) {
    const articles = await getArticlesOverview();
    return <div className="flex flex-col gap-2 p-2">
        <div className="p-2">
            <Link href="/admin/articles/bulk-edit/"><Button>Bulk Edit</Button></Link>
        </div>
        <Table>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {articles.map(a => (
                    <tr key={a.id}>
                        <ArticleRow {...a} />
                    </tr>
                ))}
            </tbody>
        </Table>
    </div>
}