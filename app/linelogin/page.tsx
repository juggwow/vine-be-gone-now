import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import Login from "./client";
import { authOptions } from "../../auth-options";

export default async function LineLogin() {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/");
  }

  return <Login />;
}
