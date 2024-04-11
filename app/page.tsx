import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import LogoutButton from "./logout";
import { authOptions } from "@/auth-options";

export default async function SignIn() {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session) {
    return redirect(`/linelogin?link=/`);
  }

  return (
    <div className="flex h-screen items-center justify-center">
      {session && <p>ล็อกอินสำเร็จ</p>}
      {session && <LogoutButton />}
    </div>
  );
}
