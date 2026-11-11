import Link from "next/link";

import { stripHtml } from "@/data/story";

import type { StoryPost } from "./types";

/**
 * The notes at the end of a story: the footnotes written for the post and the
 * people who edited it. Nothing is rendered when there are neither.
 */
export default function StoryFootnotes({
    data,
    className = "",
}: {
    data: StoryPost;
    className?: string;
}) {
    const footnotes = data.footnotes?.trim() ?? "";
    const hasFootnotes =
        footnotes.length > 0 && stripHtml(footnotes).length > 0;
    const editors = data.editors ?? [];

    if (!hasFootnotes && editors.length === 0) {
        return null;
    }

    return (
        <section
            className={[
                "mt-10 border-t border-nivarana-green/20 pt-6",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {hasFootnotes && (
                <div
                    className="post-content text-base leading-relaxed text-nivarana-charcoal/80"
                    dangerouslySetInnerHTML={{ __html: footnotes }}
                />
            )}
            {editors.length > 0 && (
                <p
                    className={[
                        "text-sm text-nivarana-charcoal",
                        hasFootnotes ? "mt-6" : "",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >
                    Edited by{" "}
                    {editors.map((editor, index) => (
                        <span key={editor.id}>
                            <Link
                                href={`/author/${editor.slug}`}
                                className="font-bold transition-colors hover:text-nivarana-green"
                            >
                                {editor.name}
                            </Link>
                            {index < editors.length - 1 ? ", " : ""}
                        </span>
                    ))}
                </p>
            )}
        </section>
    );
}
