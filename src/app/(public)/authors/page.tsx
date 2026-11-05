import Link from "next/link";

import { getAuthorsWithPublishedArticleCounts } from "./queries";

export const metadata = {
    title: "Authors",
    description: "Browse the authors published on Nivarana and their articles.",
};

export default async function AuthorsPage() {
    const authors = await getAuthorsWithPublishedArticleCounts();

    return (
        <div className="max-w-(--breakpoint-xl) mx-auto p-4">
            <h1 className="mb-8 text-4xl font-bold uppercase">Authors</h1>
            {authors.length === 0 ? (
                <p className="text-gray-500">No authors found.</p>
            ) : (
                <ul className="flex flex-col">
                    {authors.map((author) => (
                        <li
                            key={author.id}
                            className="border-b border-gray-200 py-2"
                        >
                            <Link
                                href={`/author/${author.slug}`}
                                className="font-medium hover:text-nivarana-green hover:underline"
                            >
                                {author.name}{" "}
                                <span className="text-sm text-gray-500">
                                    ({author.article_count})
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
