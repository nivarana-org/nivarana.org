import { revalidatePath } from "next/cache"

export async function GET(request: Request) {
    revalidatePath('/');
    return Response.json({"done": new Date()})
  }