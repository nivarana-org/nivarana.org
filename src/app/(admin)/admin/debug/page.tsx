import { signOut } from "@/auth"

function SignOut() {
    return (
        <form
            action={async () => {
                "use server"
                await signOut()
            }}
        >
            <button type="submit">Sign Out</button>
        </form>
    )
}

export default async function Page() {
    return <SignOut></SignOut>
}