import { parseHtml } from "../../_lib/htmlParser";

export default function BodyWithPopover({ body }: { body: string }) {
    return (
        <div className="post-content mt-4 text-lg p-2">{parseHtml(body)}</div>
    );
}
