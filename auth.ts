import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "./lib/mongodb"
import { MongoDBAdapter } from "@auth/mongodb-adapter";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
  } = NextAuth({
    adapter: MongoDBAdapter(clientPromise,{
      databaseName: "vine-be-gone-now",
    }),
    providers: [
      GoogleProvider({
        name: "google",
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET as string,
      }),
    ],
    session: {
      strategy: 'jwt',
    },
    // callbacks: {
    //   jwt: async ({ token, user }) => {
    //     if (user) {
    //       token.id = user.id
    //       token.role = user.role
    //     }
    //     return token
    //   },
    //   session: async ({ session, token }) => {
    //     if (session.user) {
    //       session.user.id = token.id
    //       session.user.role = token.role
    //     }
    //     return session
    //   }
    // },
  });