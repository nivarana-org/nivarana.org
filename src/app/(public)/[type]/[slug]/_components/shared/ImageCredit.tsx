import Link from "next/link";

import { hasImageCredit, type MediaMeta } from "../../_lib/mediaMeta";

/**
 * A small credit for an image. By default it sits in the bottom-right corner,
 * overlaying the image. The `below` variant puts it underneath the image
 * instead, right-aligned, for layouts that have room for it.
 */
export default function ImageCredit({
    meta,
    variant = "overlay",
}: {
    meta?: MediaMeta;
    variant?: "overlay" | "below";
}) {
    if (!hasImageCredit(meta)) {
        return null;
    }

    const authors = meta.authors;
    const creditText = meta.creditText?.trim();

    const positionClasses =
        variant === "below"
            ? "mt-1 ml-auto block w-fit max-w-[85%]"
            : "absolute right-2 bottom-2 z-10 block max-w-[85%]";

    return (
        <span
            className={`${positionClasses} rounded-sm bg-black/65 px-2 py-1 text-right text-[11px] leading-snug text-white shadow-sm [&_a]:underline [&_a]:underline-offset-2 [&_p]:m-0 [&_p]:inline`}
        >
            <span className="flex items-start gap-1">
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5 h-3 w-3 shrink-0"
                >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span className="min-w-0 text-right">
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
            </span>
        </span>
    );
}
