'use client'

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ClientButton(){
    const [newName,setNewName] = useState<string>("")
    const router = useRouter()
    const {update} = useSession()
    const handleClick = ()=>{
        signOut({redirect:false})
        router.push("/")
    }

    const handleUpdate = ()=>{
        update({name:newName})
        router.push("/")
    }


    return (
        <div>
            <button
            onClick={handleClick}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Logout
          </button>
          <input value={newName} onChange={(e)=>setNewName(e.target.value)}/>
          <button
            onClick={handleUpdate}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            update
          </button>
        </div>
    )
}