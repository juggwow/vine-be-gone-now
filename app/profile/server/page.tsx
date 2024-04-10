import { auth, signOut } from "@/auth";
import ClientButton from "./button";
import { getSession } from "next-auth/react";


export default async function Profile() {
    const session = await auth()
    
  // When after loading success and have session, show profile
  return (
    <div className="flex h-screen items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow-md">
          <p>
            Welcome, {session?.user?.name}<b>!</b>
          </p>
          <p>Email: {session?.user?.email}</p>
          <p>Role: </p>
          <ClientButton/>

        </div>
      </div>
  )
}