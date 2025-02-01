import { publishScheduledPostsNeedingPublication } from "@/data/cms";

export async function GET() {
    const result = await publishScheduledPostsNeedingPublication();
    return Response.json(result);
}
