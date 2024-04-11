import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { Session, User } from "next-auth";
import LineProvider from "next-auth/providers/line";
import type { Adapter, AdapterUser } from "next-auth/adapters";
import { authOptions } from "./auth-options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
