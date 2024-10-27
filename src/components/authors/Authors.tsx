import Link from "next/link"

export function Author({ path, author_name }) {
    return <li className="list-inline-item border p-1 rounded hover:bg-cyan-200">
        <Link href={'/author/' + path}>
            {author_name}
        </Link>
    </li>
}

export function NAuthors({ authors_data, author }) {
    if (authors_data) return (
        authors_data.map(a => <Author {...a} key={a.id} />)
    )
    else return <Author {...author} />
}