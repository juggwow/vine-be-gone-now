import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { Session, User } from "next-auth";
import LineProvider from "next-auth/providers/line";
import type { Adapter, AdapterUser } from "next-auth/adapters";

const adapter = MongoDBAdapter(clientPromise, {
  databaseName: "vine-be-gone-now",
});

export const authOptions = {
  providers: [
    LineProvider({
      name: "line",
      clientId: process.env.NEXTAUTH_LINE_ID as string,
      clientSecret: process.env.NEXTAUTH_LINE_SECRET as string,
    }),
  ],
  adapter: adapter as Adapter,
  callbacks: {
    session: async ({
      session,
      user,
      newSession,
      trigger,
    }: {
      session: Session;
      user: AdapterUser;
      newSession: any;
      trigger?: "update";
    }) => {
      if (trigger && newSession.name && adapter.updateUser) {
      }
      if (!session.user) {
        return session;
      }
      session.user = user;
      return session;
    },
    signIn: async ({ user }: { user: AdapterUser | User }) => {
      if (!adapter.getUser || !adapter.updateUser) {
        return true;
      }
      if (!user.role) {
        const update: Partial<AdapterUser> & Pick<AdapterUser, "id"> = {
          role: "user",
          id: user.id,
        };
        await adapter.updateUser(update);
      }
      return true;
    },
  },
};
