import { getArticlesOverview } from "@/data/cms"
import Link from "next/link";

import Table from "@mui/joy/Table"
import { Button } from "@mui/joy";

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
                </tr>
            </thead>
            <tbody>
                {articles.map(a => (
                    <tr key={a.id}>
                        <td>
                            <Link href={`/admin/articles/${a.id}`}>
                                {a.page_title}
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </div>
}