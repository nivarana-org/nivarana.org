import moment from "moment";
import Link from "next/link";

type Author = {
    id: number;
    name: string;
    slug: string;
};
type Prop = {
    authors: Author[];
    published_at: string;
};
export default function AuthorsAndPublishedTime({
    authors,
    published_at,
}: Prop) {
    return (
        <>
            {(authors || published_at) && (
                <div className="text-gray-500 mt-1">
                    {authors && (
                        <span>
                            By
                            <span className="font-medium">
                                {authors.map((author, index) => (
                                    <span
                                        key={author.id}
                                        className="inline-flex items-center"
                                    >
                                        <Link
                                            href={`/author/${author.slug}`}
                                            className="py-1 pl-1 rounded-sm hover:bg-cyan-200 hover:text-cyan-800 transition-colors duration-200"
                                        >
                                            {author.name}
                                        </Link>
                                        {index < authors.length - 2 && ", "}
                                        {index === authors.length - 2 && (
                                            <span className="pl-1"> and </span>
                                        )}
                                    </span>
                                ))}
                            </span>
                        </span>
                    )}
                    {published_at && (
                        <>
                            {authors && " | "}
                            <span>
                                {moment(published_at).format("MMM DD, YYYY")}
                            </span>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
