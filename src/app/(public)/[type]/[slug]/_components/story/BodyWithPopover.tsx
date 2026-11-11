import { parseHtml } from "../../_lib/htmlParser";
import type { MediaMetaMap } from "../../_lib/mediaMeta";

/** The opening capital of the article, printed large and sunk into the text. */
const DROP_CAP_CLASSES = [
    "[&>p:first-of-type]:first-letter:float-left",
    "[&>p:first-of-type]:first-letter:mr-2",
    "[&>p:first-of-type]:first-letter:font-heading",
    "[&>p:first-of-type]:first-letter:font-bold",
    "[&>p:first-of-type]:first-letter:text-nivarana-green",
    "[&>p:first-of-type]:first-letter:text-[4.5em]",
    "[&>p:first-of-type]:first-letter:leading-[0.8]",
    "[&>p:first-of-type]:first-letter:pt-[0.05em]",
].join(" ");

/**
 * The single body renderer for every story. A chapter body and a plain
 * article body are the same thing: an HTML fragment produced by TinyMCE.
 */
export default function BodyWithPopover({
    body,
    mediaMeta,
    className = "",
    dropCap = false,
}: {
    body: string;
    mediaMeta: MediaMetaMap;
    className?: string;
    /** Turns the first letter of the first paragraph into a drop cap. */
    dropCap?: boolean;
}) {
    return (
        <div
            className={[
                "post-content text-lg",
                dropCap ? DROP_CAP_CLASSES : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {parseHtml(body, mediaMeta)}
        </div>
    );
}
