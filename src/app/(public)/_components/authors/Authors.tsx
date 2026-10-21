import Link from "next/link";

/** The author details an article preview shows. */
export type ArticleAuthor = {
    id: number;
    name: string;
    slug: string;
};

export function Author({ slug, name }: Omit<ArticleAuthor, "id">) {
    return (
        <li className="list-inline-item border p-1 rounded-sm hover:bg-cyan-200">
            <Link href={"/author/" + slug}>{name}</Link>
        </li>
    );
}

export function NAuthors({ authors }: { authors: ArticleAuthor[] }) {
    return authors.map((a) => (
        <Author slug={a.slug} name={a.name} key={a.id} />
    ));
}
