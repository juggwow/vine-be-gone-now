import NextAuth, { Account, DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User {
      id? : number
      role?: string
    }
    
  }

  declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      id?: string | number
    }
}
  }

declare module "next-auth/jwt" {
    interface JWT {
      id? : number|string
      role?: string
    }
  }

