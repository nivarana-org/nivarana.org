import { parseHtml } from "../../_lib/htmlParser";

/**
 * The single body renderer for every story. A chapter body and a plain
 * article body are the same thing: an HTML fragment produced by TinyMCE.
 */
export default function BodyWithPopover({
    body,
    className = "",
}: {
    body: string;
    className?: string;
}) {
    return (
        <div className={`post-content mt-4 text-lg p-2 ${className}`}>
            {parseHtml(body)}
        </div>
    );
}
