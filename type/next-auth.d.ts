import NextAuth, { Account, DefaultSession, User, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    businessName?: string;
    mobileNo?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      businessName?: string | null;
      mobileNo?: string | null;
    };
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    id: string;
    email: string | null;
    image?: string;
    emailVerified: Date | null;
    role?: string;
    businessName?: string | null;
    mobileNo?: string | null;
  }
}

// declare module "next-auth/jwt" {
//     interface JWT {
//       id? : number|string
//       provider: string
//     }
//   }
