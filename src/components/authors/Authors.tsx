import Link from "next/link";

export function Author({ path, name }) {
    return (
        <li className="list-inline-item border p-1 rounded-sm hover:bg-cyan-200">
            <Link href={"/author/" + path}>{name}</Link>
        </li>
    );
}

export function NAuthors({ authors }) {
    return authors.map((a) => <Author {...a} key={a.id} />);
}
