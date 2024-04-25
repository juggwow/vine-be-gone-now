"use client"
import liff from "@line/liff";
import { useEffect } from "react";
import { useFormState } from 'react-dom'
import { addProfile } from "./action";
import SendIcon from "@mui/icons-material/Send";


const initialState = {
  message: '',
}

export default function ProfileForm(){
  
  const [state, formAction] = useFormState(addProfile, initialState)

    useEffect(() => {
        const initialLiff = async () => {
          try {
            await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID as string });
          } catch (error) {
            console.error("liff init error");
          }
          if (!liff.isLoggedIn()) {
            liff.login();
          } 
        
          if(!(await liff.getFriendship()).friendFlag){
            window.open("https://line.me/ti/p/@409wseyb")
          }
    
          
        };
        initialLiff();
      }, []);
    return(
        <div>
          {state.message}
          <form
            action={formAction}
            className="w-full flex flex-col max-w-[400px] justify-center"
          >
            <label className="w-full" htmlFor="name">
              ชื่อ-สกุล
            </label>
            <input
              required
              className="w-5/6 outline-1 outline-red-400 bg-inherit border-2 border-slate-400 rounded-lg px-3 py-2"
              type="text"
              id="name"
              name="name"
            />
            <label className="w-full mt-3" htmlFor="mobileno">
              หมายเลขโทรศัพท์
            </label>
            <input
              required
              className="w-5/6 mb-6 outline-1 outline-red-400 bg-inherit border-2 border-slate-400 rounded-lg px-3 py-2"
              type="text"
              id="mobileno"
              name="mobileno"
            />

<button
                type="submit"
                className=" ring-2 hover:ring-offset-2 rounded-full ring-slate-400 text-slate-400 p-3"
              >
                <SendIcon />
              </button>
          </form>

        </div>
    )
}