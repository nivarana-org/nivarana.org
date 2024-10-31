import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({
    profile(profile) {
      const { email, email_verified, name, picture, given_name, family_name } = profile
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