import Link from "next/link";

import { hasMediaCredit, type MediaCredit } from "../../_lib/mediaCredits";

/**
 * A small credit that sits in the bottom-right corner of an image. It is not
 * a caption: the body may already have one, so this deliberately overlays the
 * image itself.
 */
export default function ImageCredit({ credit }: { credit?: MediaCredit }) {
    if (!hasMediaCredit(credit)) {
        return null;
    }

    const authors = credit.authors;
    const creditText = credit.creditText?.trim();

    return (
        <span className="absolute right-2 bottom-2 z-10 block max-w-[85%] rounded-sm bg-black/65 px-2 py-1 text-right text-[11px] leading-snug text-white shadow-sm [&_a]:underline [&_a]:underline-offset-2 [&_p]:m-0 [&_p]:inline">
            {authors.length > 0 && (
                <span className="block">
                    {authors.map((author, index) => (
                        <span key={author.id}>
                            {index > 0 ? ", " : null}
                            {author.slug ? (
                                <Link href={`/author/${author.slug}`}>
                                    {author.name}
                                </Link>
                            ) : (
                                author.name
                            )}
                        </span>
                    ))}
                </span>
            )}
            {creditText && (
                <span
                    className="block"
                    dangerouslySetInnerHTML={{ __html: creditText }}
                />
            )}
        </span>
    );
}
