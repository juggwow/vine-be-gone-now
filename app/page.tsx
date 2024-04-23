import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import LogoutButton from "./logout";
import { authOptions } from "@/auth-options";
import VineBeGoneNow from "./vine";

export default async function SignIn() {

  return (
    <VineBeGoneNow/>
  );
}
