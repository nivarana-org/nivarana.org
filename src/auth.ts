import NextAuth from "next-auth"
import Google, { GoogleProfile } from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({
    profile(profile: GoogleProfile) {
      const { email, name, picture } = profile
      if (process.env.ADMINS?.includes(email)) {
        return { role: "admin", email, name, picture }
      }
      return { role: "user", email, name, picture }
    }
  })],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth
    },
    jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    session({ session, token }) {
      session.user.role = token.role
      return session
    }
  }
})