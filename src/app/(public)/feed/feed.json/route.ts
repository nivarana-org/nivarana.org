import { getFeed } from "../assemble";

export async function GET() {
    const feed = await getFeed();
    return new Response(feed.json1(), {
        headers: {
            "Content-Type": "application/feed+json; charset=utf-8",
        },
    });
}
