"use client";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const searchParams = useSearchParams();
  const link = searchParams.get("link");
  useEffect(() => {
    signIn("line", { callbackUrl: link ? link : undefined });
  }, []);
  return <p>Sign In....</p>;
}
