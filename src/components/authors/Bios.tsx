import Link from "next/link";

export function NAuthorsBio({ authors }) {
    return (
        <div className="flex flex-col gap-1">
            {authors.map((a) => (
                <AuthorBio {...a} key={a.id} />
            ))}
        </div>
    );
}
export function AuthorBio({ path, name, email, description }) {
    return (
        <Link href={"/author/" + path}>
            <div className="bg-nivarana-white/50 md:mx-4 rounded">
                <div className="p-2 md:max-w-3xl md:mx-auto">
                    <div className="text-xl text-nivarana-green">{name}</div>
                    <div
                        className=""
                        dangerouslySetInnerHTML={{ __html: description }}
                    ></div>
                    {email && <div>Email: {email}</div>}
                </div>
            </div>
        </Link>
    );
}
