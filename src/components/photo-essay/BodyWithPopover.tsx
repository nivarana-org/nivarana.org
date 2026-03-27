import { parseHtml } from "@/utils/htmlParser";

export default function BodyWithPopover({ body }: { body: string }) {
    return (
        <div className="post-content mt-4 max-w-4xl mx-auto text-lg p-2">
            {parseHtml(body)}
        </div>
    );
}
