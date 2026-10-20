import { getFeed } from "../_lib/assemble";

export async function GET() {
    const feed = await getFeed();
    return new Response(feed.atom1(), {
        headers: {
            "Content-Type": "application/atom+xml; charset=utf-8",
        },
    });
}
