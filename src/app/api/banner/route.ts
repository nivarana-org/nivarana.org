import { getSettings } from "@/data/cms";

export async function GET() {
    const settings = await getSettings([
        "banner.live",
        "banner.heading",
        "banner.content.head",
        "banner.content.foot",
    ]);

    return Response.json(settings);
}
