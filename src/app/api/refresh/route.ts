import { revalidatePath } from "next/cache"
import { NextRequest } from "next/server";

const invalidate = (path: string, type?: "layout" | "page") => {
  revalidatePath(path, type);
  return Response.json({"done": new Date()})
}

export async function GET(request: NextRequest) {
    const key = request.nextUrl.searchParams.get('key')
    if (key !== process.env.REVALIDATE_KEY) {
      return Response.json({"done": false});
    }
    const path = request.nextUrl.searchParams.get('path') || '/'
    const type = request.nextUrl.searchParams.get('type')
    if (type === null) {
      return invalidate(path)
    }
    if (!(type === "layout" || type === "page")) return Response.json({
      done: "false",
      reason: `Invalid type ${type}`
    })
    return invalidate(path, type);
  }