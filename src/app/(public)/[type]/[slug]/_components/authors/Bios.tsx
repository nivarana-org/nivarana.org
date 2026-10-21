import Link from "next/link";

import { READING_MEASURE } from "../../_lib/layout";

export function NAuthorsBio({ authors }: { authors: Author[] }) {
    return (
        <div className="mx-auto mt-12 w-full max-w-7xl px-5 md:px-6">
            <div className={`mx-auto w-full ${READING_MEASURE}`}>
                <div className="flex flex-col gap-6">
                    {authors.map((a) => (
                        <AuthorBio {...a} key={a.id} />
                    ))}
                </div>
            </div>
        </div>
    );
}

type Author = {
    id: number;
    slug: string;
    name: string;
    email?: string;
    bio?: string;
};

export function AuthorBio({ slug, name, email, bio }: Author) {
    return (
        <Link href={"/author/" + slug} className="block">
            <div className="rounded-lg bg-nivarana-white/50">
                <div className="p-6 text-center md:p-8">
                    <div className="text-xl font-bold text-nivarana-green">
                        {name}
                    </div>
                    <div
                        className="mt-3 text-sm leading-relaxed text-nivarana-charcoal"
                        dangerouslySetInnerHTML={{ __html: bio ?? "" }}
                    ></div>
                    {email && (
                        <div className="mt-3 text-sm text-nivarana-charcoal/80">
                            Email: {email}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
