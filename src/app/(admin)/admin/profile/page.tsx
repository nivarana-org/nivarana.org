import { auth } from "@/auth"
import Link from "next/link"

export default async function Page() {
  const session = await auth()
  if (!session) return <div>Not authenticated</div>

  return (
    <div>
      <div>
        Logged in as {session.user.role} with account {session.user.name} &lt;{session.user.email}&gt;
        <Link href="/api/auth/signout" className="bg-cyan-100 p-1">Log Out</Link></div>
      <div className="mt-5">
        <h2>More details</h2>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </div>
  )
}