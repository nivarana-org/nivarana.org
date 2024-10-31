import NextAuth from "next-auth"

type Role = "admin" | "user"

declare module "next-auth" {
    interface Session {
        user: {
            role: Role
        }
    }
    interface User {
        role: Role
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        role: Role
    }
}

export default NextAuth