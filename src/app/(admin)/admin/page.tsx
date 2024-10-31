import { auth } from "@/auth"
import Link from "next/link"

export default async function Page() {
  const session = await auth()
  if (!session) return <div>Not authenticated</div>

  return (
    <div>
      <Link href="/admin/newsletter">Newsletter Subscribers</Link>
    </div>
  )
}