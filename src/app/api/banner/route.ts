import { getSettings } from "./queries";

export async function GET() {
    const settings = await getSettings([
        "banner.live",
        "banner.heading",
        "banner.content.head",
        "banner.content.foot",
        "banner.date",
    ]);

    return Response.json(settings);
}
