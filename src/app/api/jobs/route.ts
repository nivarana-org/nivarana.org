import { publishScheduledPostsNeedingPublication } from "@/data/cms";
import { revalidatePath } from "next/cache";

export async function GET() {
    const result = await publishScheduledPostsNeedingPublication();
    if (result > 0) {
        revalidatePath("/", "layout");
    }
    return Response.json(result);
}
